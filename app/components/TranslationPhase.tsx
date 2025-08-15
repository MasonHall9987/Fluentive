"use client";
import { SentenceItem, Direction, ValidationResponseBody } from '@/lib/types';

interface TranslationPhaseProps {
  current: SentenceItem;
  userTranslation: string;
  validationMsg: string | null;
  translationResult: ValidationResponseBody | null;
  showTranslationCorrection: boolean;
  followUpQuestion: string;
  followUpResponse: string | null;
  direction: Direction;
  onTranslationChange: (text: string) => void;
  onValidateTranslation: () => void;
  onSkipTranslation: () => void;
  onNextSentence: () => void;
  onRetryTranslation: () => void;
  onPlayAudio: (rate: number) => void;
  isAudioPlaying: boolean;
  onFollowUpQuestionChange: (question: string) => void;
  onHandleFollowUpQuestion: () => void;
}

const TextWithDefinitions = ({ current }: { current: SentenceItem }) => {
  const text = current.text;
  type Segment = { start: number; end: number; defTitle?: string };
  const marks: Segment[] = [];
  
  for (const def of current.definitions) {
    for (const occ of def.occurrences) {
      const start = Math.max(0, Math.min(text.length, occ.startIndex));
      const end = Math.max(start, Math.min(text.length, occ.endIndex));
      marks.push({ start, end, defTitle: `${def.definition}` });
    }
  }
  
  marks.sort((a, b) => a.start - b.start || b.end - a.end);
  const merged: Segment[] = [];
  for (const m of marks) {
    const last = merged[merged.length - 1];
    if (!last || m.start >= last.end) merged.push(m);
  }
  
  const segments: Segment[] = [];
  let cursor = 0;
  for (const m of merged) {
    if (cursor < m.start) segments.push({ start: cursor, end: m.start });
    segments.push(m);
    cursor = m.end;
  }
  if (cursor < text.length) segments.push({ start: cursor, end: text.length });
  
  return (
    <p className="text-white text-3xl sm:text-4xl leading-relaxed font-semibold">
      {segments.map((s, i) => {
        const slice = text.slice(s.start, s.end);
        if (!s.defTitle) return <span key={i}>{slice}</span>;
        return (
          <span key={i} className="relative inline-block group underline decoration-dotted cursor-help">
            {slice}
            <span className="pointer-events-none absolute z-50 -top-9 left-1/2 -translate-x-1/2 whitespace-pre rounded bg-white text-black text-xs px-2 py-1 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition will-change-transform shadow">
              {s.defTitle}
            </span>
          </span>
        );
      })}
    </p>
  );
};

const TranslationComparison = ({
  current,
  userTranslation,
  translationResult,
  followUpQuestion,
  followUpResponse,
  onFollowUpQuestionChange,
  onHandleFollowUpQuestion
}: {
  current: SentenceItem;
  userTranslation: string;
  translationResult: ValidationResponseBody;
  followUpQuestion: string;
  followUpResponse: string | null;
  onFollowUpQuestionChange: (question: string) => void;
  onHandleFollowUpQuestion: () => void;
}) => {
  return (
    <div className="mt-4 p-4 border rounded bg-gray-900">
      <div className="space-y-3">
        <div>
          <span className="text-sm text-gray-300">Your answer: </span>
          <span className="text-white">{userTranslation}</span>
        </div>
        <div>
          <span className="text-sm text-gray-300">Correct answer: </span>
          <span className="text-green-400">{current.translation}</span>
        </div>
        {translationResult.correctedTranslation && translationResult.correctedTranslation !== current.translation && (
          <div>
            <span className="text-sm text-gray-300">More natural: </span>
            <span className="text-blue-400">{translationResult.correctedTranslation}</span>
          </div>
        )}
        
        {/* Follow-up question section */}
        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="text-sm text-gray-300 mb-2">Have a question about this correction?</div>
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded px-2 py-1 text-sm"
              placeholder="Ask about your mistake..."
              value={followUpQuestion}
              onChange={(e) => onFollowUpQuestionChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onHandleFollowUpQuestion()}
            />
            <button 
              className="border rounded px-3 py-1 text-sm"
              onClick={onHandleFollowUpQuestion}
              disabled={!followUpQuestion.trim()}
            >
              Ask
            </button>
          </div>
          {followUpResponse && (
            <div className="mt-2 p-2 bg-gray-800 rounded text-sm text-gray-200">
              <strong>AI:</strong> {followUpResponse}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const TranslationPhase = ({
  current,
  userTranslation,
  validationMsg,
  translationResult,
  showTranslationCorrection,
  followUpQuestion,
  followUpResponse,
  direction,
  onTranslationChange,
  onValidateTranslation,
  onSkipTranslation,
  onNextSentence,
  onRetryTranslation,
  onPlayAudio,
  isAudioPlaying,
  onFollowUpQuestionChange,
  onHandleFollowUpQuestion
}: TranslationPhaseProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-gray-300 text-sm">Translate this sentence:</div>
        {current.audioUrl && (
          <div className="flex gap-2">
            <button 
              className="border rounded px-3 py-1 disabled:opacity-50" 
              onClick={() => onPlayAudio(1.0)} 
              disabled={isAudioPlaying}
            >
              🔊 Play
            </button>
            <button 
              className="border rounded px-3 py-1 disabled:opacity-50" 
              onClick={() => onPlayAudio(0.5)} 
              disabled={isAudioPlaying}
            >
              🔊 Slow
            </button>
          </div>
        )}
      </div>
      
      <TextWithDefinitions current={current} />
      
      <input
        className="w-full border rounded px-3 py-2"
        placeholder={`Translate to ${direction === "es-to-en" ? "English" : "Spanish"}`}
        value={userTranslation}
        onChange={(e) => onTranslationChange(e.target.value)}
      />
      
      <div className="flex gap-2">
        <button 
          className="bg-white text-black rounded px-4 py-2" 
          onClick={onValidateTranslation}
        >
          Check translation
        </button>
        <button 
          className="border rounded px-3 py-2" 
          onClick={onSkipTranslation}
        >
          Skip
        </button>
      </div>
      
      {validationMsg && <p className="text-sm text-gray-200">{validationMsg}</p>}
      
      {showTranslationCorrection && translationResult && (
        <TranslationComparison 
          current={current}
          userTranslation={userTranslation}
          translationResult={translationResult}
          followUpQuestion={followUpQuestion}
          followUpResponse={followUpResponse}
          onFollowUpQuestionChange={onFollowUpQuestionChange}
          onHandleFollowUpQuestion={onHandleFollowUpQuestion}
        />
      )}
      
      {translationResult && (
        <div className="text-center space-x-3">
          {!translationResult.isCorrect && (
            <button 
              className="border rounded px-4 py-2" 
              onClick={onRetryTranslation}
            >
              Try again
            </button>
          )}
          <button 
            className="bg-green-600 text-white rounded px-6 py-3" 
            onClick={onNextSentence}
          >
            Next sentence →
          </button>
        </div>
      )}
    </div>
  );
};
