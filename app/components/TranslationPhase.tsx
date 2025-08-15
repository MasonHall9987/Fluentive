"use client";
import { SentenceItem, Direction, ValidationResponseBody } from '@/lib/types';
import { Globe, Lightbulb, Volume2, Turtle, CheckCircle, SkipForward, RefreshCw, ArrowRight, Bot, HelpCircle, X, Send, MessageSquare } from 'lucide-react';

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
    <div className="glass p-6 rounded-xl">
      <p className="text-white text-2xl md:text-3xl lg:text-4xl leading-relaxed font-medium">
        {segments.map((s, i) => {
          const slice = text.slice(s.start, s.end);
          if (!s.defTitle) return <span key={i}>{slice}</span>;
          return (
            <span key={i} className="relative inline-block group underline decoration-dotted decoration-2 decoration-yellow-400/60 cursor-help hover:decoration-yellow-400 transition-all duration-200">
              {slice}
              <span className="pointer-events-none absolute z-50 -top-12 left-1/2 -translate-x-1/2 whitespace-pre rounded-lg glass border border-yellow-400/30 text-yellow-100 text-sm px-4 py-3 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 will-change-transform shadow-xl backdrop-blur-md flex items-start gap-2">
                <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{s.defTitle}</span>
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-white/10 border-r border-b border-yellow-400/30 inline-block"></span>
              </span>
            </span>
          );
        })}
      </p>
    </div>
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
    <div className="glass p-10 md:p-12 animate-slide-up space-y-10">
      <div className="flex items-center justify-center gap-4">
        <MessageSquare className="w-8 h-8 text-[var(--keppel)]" />
        <h4 className="text-2xl md:text-3xl font-semibold text-white">
          Translation Review
        </h4>
      </div>
      
      <div className="space-y-8">
        {/* User's Answer */}
        <div className="p-8 rounded-xl bg-white/5 border border-white/10">
          <span className="text-base text-gray-400 uppercase tracking-wide block mb-4">Your Translation</span>
          <span className="text-white text-2xl">{userTranslation}</span>
        </div>

        {/* Expected Answer */}
        <div className="p-8 rounded-xl status-correct border border-green-400/30">
          <span className="text-base text-green-200 uppercase tracking-wide block mb-4">Expected Translation</span>
          <span className="text-white text-2xl font-medium">{current.translation}</span>
        </div>

        {/* More Natural Version */}
        {translationResult.correctedTranslation && translationResult.correctedTranslation !== current.translation && (
          <div className="p-8 rounded-xl bg-blue-500/10 border border-blue-400/30">
            <span className="text-base text-blue-200 uppercase tracking-wide block mb-4">More Natural Version</span>
            <span className="text-white text-2xl font-medium">{translationResult.correctedTranslation}</span>
          </div>
        )}

        {/* AI Feedback */}
        {translationResult.message && (
          <div className="p-8 rounded-xl status-warning border border-yellow-400/30">
            <div className="flex items-start gap-4">
              <Lightbulb className="w-7 h-7 text-yellow-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <span className="text-base text-yellow-200 uppercase tracking-wide block mb-4">AI Feedback</span>
                <span className="text-white text-xl leading-relaxed">{translationResult.message}</span>
              </div>
            </div>
          </div>
        )}
      </div>
        
      {/* Follow-up Question Section */}
      <div className="space-y-8 pt-8 border-t border-white/10">
        <div className="flex items-center justify-center gap-4">
          <HelpCircle className="w-7 h-7 text-[var(--light-green)]" />
          <h5 className="text-xl font-medium text-white">Ask a Follow-up Question</h5>
        </div>
        
        <div className="space-y-6">
          <input
            className="modern-input w-full px-8 py-6 text-lg mx-4"
            placeholder="Ask about your mistake, grammar rules, or alternative translations..."
            value={followUpQuestion}
            onChange={(e) => onFollowUpQuestionChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onHandleFollowUpQuestion()}
          />
          <div className="flex justify-center">
            <button 
              className={`btn-audio ${
                followUpQuestion.trim() 
                  ? "btn-audio-primary" 
                  : "btn-audio-disabled"
              }`}
              onClick={onHandleFollowUpQuestion}
              disabled={!followUpQuestion.trim()}
            >
              <Send className="w-6 h-6" />
              <span>Ask AI</span>
            </button>
          </div>
        </div>
        
        {followUpResponse && (
          <div className="glass p-8 animate-slide-up border border-blue-400/30">
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Bot className="w-6 h-6 text-blue-300" />
              </div>
              <div className="flex-1">
                <div className="text-base text-blue-200 uppercase tracking-wide mb-4">AI Assistant</div>
                <div className="text-white text-lg leading-relaxed">{followUpResponse}</div>
              </div>
            </div>
          </div>
        )}
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
    <div className="space-y-10 md:space-y-12">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-4">
          <Globe className="w-10 h-10 text-[var(--keppel)]" />
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Translate the Sentence
          </h3>
        </div>
        <p className="text-gray-300 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
          Translate from {direction === "es-to-en" ? "Spanish to English" : "English to Spanish"}
        </p>

        {/* Audio Controls */}
        {current.audioUrl && (
          <div className="flex justify-center pt-6">
            <div className="flex gap-6 p-6 glass rounded-2xl">
              <button 
                className={`btn-audio ${
                  isAudioPlaying ? "btn-audio-disabled" : "btn-audio-primary"
                }`}
                onClick={() => onPlayAudio(1.0)} 
                disabled={isAudioPlaying}
              >
                <Volume2 className="w-6 h-6" />
                <span>Listen</span>
              </button>
              <button 
                className={`btn-audio ${
                  isAudioPlaying ? "btn-audio-disabled" : "btn-audio-secondary"
                }`}
                onClick={() => onPlayAudio(0.5)} 
                disabled={isAudioPlaying}
              >
                <Turtle className="w-6 h-6" />
                <span>Slow</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Source Sentence with Definitions */}
      <div className="space-y-6">
        <h4 className="text-lg font-medium text-gray-200 uppercase tracking-wide text-center">
          Source Sentence
        </h4>
        <TextWithDefinitions current={current} />
        <p className="text-base text-gray-400 text-center flex items-center justify-center gap-3">
          <Lightbulb className="w-5 h-5" />
          <span>Hover over underlined words for definitions</span>
        </p>
      </div>
      
      {/* Translation Input */}
      <div className="glass p-10 md:p-12 space-y-8">
        <label className="block text-lg font-medium text-gray-200 text-center mb-4">
          Your Translation
        </label>
        <input
          className="modern-input w-full px-8 py-6 text-2xl placeholder:text-gray-400 mx-4"
          placeholder={`Write your ${direction === "es-to-en" ? "English" : "Spanish"} translation here...`}
          value={userTranslation}
          onChange={(e) => onTranslationChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onValidateTranslation()}
        />
        <div className="text-right text-base text-gray-400 px-4">
          {userTranslation.length} characters
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <button 
          className="btn-action btn-action-primary" 
          onClick={onValidateTranslation}
        >
          <CheckCircle className="w-6 h-6" />
          <span>Check Translation</span>
        </button>
        <button 
          className="btn-action btn-action-secondary" 
          onClick={onSkipTranslation}
        >
          <SkipForward className="w-6 h-6" />
          <span>Skip This One</span>
        </button>
      </div>
      
      {/* Validation Message */}
      {validationMsg && (
        <div className={`p-8 rounded-xl border animate-slide-up ${
          translationResult?.isCorrect 
            ? 'status-correct border-green-400/30' 
            : 'status-warning border-yellow-400/30'
        }`}>
          <div className="flex items-center gap-4">
            {translationResult?.isCorrect ? <CheckCircle className="w-7 h-7" /> : <HelpCircle className="w-7 h-7" />}
            <span className="text-white font-medium text-xl">{validationMsg}</span>
          </div>
        </div>
      )}
      
      {/* Translation Comparison */}
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
      
      {/* Next Actions */}
      {translationResult && (
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up pt-4">
          {!translationResult.isCorrect && (
            <button 
              className="btn-action btn-action-warning" 
              onClick={onRetryTranslation}
            >
              <RefreshCw className="w-6 h-6" />
              <span>Try Again</span>
            </button>
          )}
          <button 
            className="btn-next" 
            onClick={onNextSentence}
          >
            <span>Next Sentence</span>
            <ArrowRight className="w-7 h-7" />
          </button>
        </div>
      )}
    </div>
  );
};
