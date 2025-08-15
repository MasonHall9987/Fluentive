"use client";
import { SentenceItem, Direction } from '@/lib/types';
import { Headphones, Mic, MicOff, CheckCircle, SkipForward, ArrowRight, Lightbulb, X, Check } from 'lucide-react';

interface TranscriptionPhaseProps {
  current: SentenceItem;
  userTranscription: string;
  sttListening: boolean;
  validationMsg: string | null;
  transcriptionCorrect: boolean;
  showTranscriptionHelp: boolean;
  transcriptionInputRef: React.RefObject<HTMLDivElement | null>;
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
    <div className="glass p-8 animate-slide-up">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Lightbulb className="w-6 h-6 text-[var(--light-green)]" />
          <h4 className="text-lg font-medium text-white">
            Transcription Comparison
          </h4>
        </div>
        
        <div className="space-y-5">
          <div className="p-5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-sm text-gray-400 block mb-3">Your answer:</span>
            <span className="text-white text-xl">{userTranscription || "No answer provided"}</span>
          </div>
          
          <div className="p-5 rounded-xl status-correct border border-green-400/30">
            <span className="text-sm text-green-200 block mb-3">Correct answer:</span>
            <span className="text-white text-xl font-medium">{current.text}</span>
          </div>
        </div>
        
        {expected !== user && (
          <div className="flex items-start gap-3 p-5 rounded-xl bg-yellow-500/10 border border-yellow-400/30">
            <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <span className="text-yellow-200">
              Keep trying! Listen carefully and compare the differences above.
            </span>
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
    <div className="space-y-10 md:space-y-12">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-4">
          <Headphones className="w-10 h-10 text-[var(--keppel)]" />
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Listen & Transcribe
          </h3>
        </div>
        <p className="text-gray-300 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
          Listen carefully and type exactly what you hear
        </p>
      </div>
      
      {/* Input Area */}
      <div className="glass p-10 md:p-12 space-y-8">
        <div className="relative">
          <div
            ref={transcriptionInputRef}
            contentEditable
            className="modern-input text-white text-2xl md:text-3xl lg:text-4xl leading-relaxed font-medium min-h-[180px] p-10 focus:ring-2 focus:ring-blue-400/50 mx-4"
            style={{ lineHeight: "1.5" }}
            onInput={(e) => onTranscriptionChange(e.currentTarget.textContent || "")}
            suppressContentEditableWarning={true}
          />
          {!userTranscription && (
            <div className="absolute top-10 left-14 text-gray-500 text-2xl md:text-3xl lg:text-4xl pointer-events-none">
              Click here and type what you hear...
            </div>
          )}
        </div>

        {/* Character Count */}
        <div className="text-right text-base text-gray-400 px-4">
          {userTranscription.length} characters
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center">
        <button 
          className={`btn-action ${
            sttListening ? 'btn-recording' : 'btn-action-primary'
          }`}
          onClick={() => onSttToggle(direction)}
        >
          {sttListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          <span>{sttListening ? "Stop Recording" : "Start Recording"}</span>
        </button>
        
        <button 
          className="btn-action btn-action-blue" 
          onClick={onValidateTranscription}
        >
          <CheckCircle className="w-6 h-6" />
          <span>Check Transcription</span>
        </button>
        
        <button 
          className="btn-action btn-action-secondary" 
          onClick={onSkipTranscription}
        >
          <SkipForward className="w-6 h-6" />
          <span>Skip</span>
        </button>
      </div>
      
      {/* Validation Message */}
      {validationMsg && (
        <div className={`p-8 rounded-xl border animate-slide-up ${
          transcriptionCorrect 
            ? 'status-correct border-green-400/30' 
            : 'status-incorrect border-red-400/30'
        }`}>
          <div className="flex items-center gap-4">
            {transcriptionCorrect ? <Check className="w-7 h-7" /> : <X className="w-7 h-7" />}
            <span className="text-white font-medium text-xl">{validationMsg}</span>
          </div>
        </div>
      )}
      
      {/* Transcription Comparison */}
      <TranscriptionComparison 
        current={current}
        userTranscription={userTranscription}
        showTranscriptionHelp={showTranscriptionHelp}
      />
      
      {/* Continue Button */}
      {transcriptionCorrect && (
        <div className="text-center animate-slide-up pt-4">
          <button 
            className="btn-next mx-auto" 
            onClick={onProceedToTranslation}
          >
            <span>Continue to Translation</span>
            <ArrowRight className="w-7 h-7" />
          </button>
        </div>
      )}
    </div>
  );
};
