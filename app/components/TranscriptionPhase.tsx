"use client";
import { SentenceItem, Direction } from '@/lib/types';

interface TranscriptionPhaseProps {
  current: SentenceItem;
  userTranscription: string;
  sttListening: boolean;
  validationMsg: string | null;
  transcriptionCorrect: boolean;
  showTranscriptionHelp: boolean;
  transcriptionInputRef: React.RefObject<HTMLDivElement>;
  onTranscriptionChange: (text: string) => void;
  onSttToggle: (direction: Direction) => void;
  onValidateTranscription: () => void;
  onSkipTranscription: () => void;
  onProceedToTranslation: () => void;
  direction: Direction;
}

const TranscriptionComparison = ({ 
  current, 
  userTranscription, 
  showTranscriptionHelp 
}: { 
  current: SentenceItem;
  userTranscription: string;
  showTranscriptionHelp: boolean;
}) => {
  if (!showTranscriptionHelp) return null;
  
  const expected = current.text.toLowerCase().trim();
  const user = userTranscription.toLowerCase().trim();
  
  return (
    <div className="mt-4 p-4 border rounded bg-gray-900">
      <div className="space-y-2">
        <div>
          <span className="text-sm text-gray-300">Your answer: </span>
          <span className="text-white">{userTranscription}</span>
        </div>
        <div>
          <span className="text-sm text-gray-300">Correct answer: </span>
          <span className="text-green-400">{current.text}</span>
        </div>
        {expected !== user && (
          <div className="text-sm text-yellow-300">
            Keep trying! Listen carefully and try again.
          </div>
        )}
      </div>
    </div>
  );
};

export const TranscriptionPhase = ({
  current,
  userTranscription,
  sttListening,
  validationMsg,
  transcriptionCorrect,
  showTranscriptionHelp,
  transcriptionInputRef,
  onTranscriptionChange,
  onSttToggle,
  onValidateTranscription,
  onSkipTranscription,
  onProceedToTranslation,
  direction
}: TranscriptionPhaseProps) => {
  return (
    <div className="space-y-4">
      <div className="text-gray-300 text-sm">Listen and type what you hear:</div>
      
      <div className="relative">
        <div
          ref={transcriptionInputRef}
          contentEditable
          className="text-white text-3xl sm:text-4xl leading-relaxed font-semibold border-2 border-gray-600 rounded p-4 min-h-[120px] focus:outline-none focus:border-blue-500"
          style={{ lineHeight: "1.5" }}
          onInput={(e) => onTranscriptionChange(e.currentTarget.textContent || "")}
          suppressContentEditableWarning={true}
        />
        {!userTranscription && (
          <div className="absolute top-4 left-4 text-gray-500 text-3xl sm:text-4xl pointer-events-none">
            Click here and type what you hear...
          </div>
        )}
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <button 
          className={`border rounded px-3 py-2 ${sttListening ? 'bg-red-600 text-white' : ''}`} 
          onClick={() => onSttToggle(direction)}
        >
          {sttListening ? "Stop Recording" : "🎤 Record"}
        </button>
        <button 
          className="bg-blue-600 text-white rounded px-4 py-2" 
          onClick={onValidateTranscription}
        >
          Check Transcription
        </button>
        <button 
          className="border rounded px-3 py-2" 
          onClick={onSkipTranscription}
        >
          Skip
        </button>
      </div>
      
      {validationMsg && <p className="text-sm text-gray-200">{validationMsg}</p>}
      
      <TranscriptionComparison 
        current={current}
        userTranscription={userTranscription}
        showTranscriptionHelp={showTranscriptionHelp}
      />
      
      {transcriptionCorrect && (
        <div className="text-center">
          <button 
            className="bg-green-600 text-white rounded px-6 py-3" 
            onClick={onProceedToTranslation}
          >
            Continue to Translation →
          </button>
        </div>
      )}
    </div>
  );
};
