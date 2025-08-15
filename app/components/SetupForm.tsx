"use client";
import { Direction } from '@/lib/types';
import { GrammarTopicSelector } from './GrammarTopicSelector';
import { Settings, Play, Loader2 } from 'lucide-react';

type Mode = "both" | Direction;

interface SetupFormProps {
  topic: string;
  selectedGrammarTopics: string[];
  mode: Mode;
  loading: boolean;
  onTopicChange: (topic: string) => void;
  onGrammarTopicsChange: (topics: string[]) => void;
  onModeChange: (mode: Mode) => void;
  onStart: () => void;
}

export const SetupForm = ({
  topic,
  selectedGrammarTopics,
  mode,
  loading,
  onTopicChange,
  onGrammarTopicsChange,
  onModeChange,
  onStart
}: SetupFormProps) => {
  return (
    <div className="space-y-12 md:space-y-14 lg:space-y-16">
      {/* Header Section */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-6">
          <Settings className="w-10 h-10 text-[var(--keppel)]" />
          <h2 className="text-3xl md:text-3xl lg:text-4xl font-bold text-white">
            Configure Your Learning Session
          </h2>
        </div>
        <p className="text-xl md:text-xl lg:text-xl text-white">
          Set up your personalized language practice session
        </p>
      </div>

      {/* Topic Input */}
      <div className="space-y-6">
        <label className="block text-lg font-medium text-gray-200 mb-2">
          Topic <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          className="modern-input w-full px-8 py-6 text-xl placeholder:text-gray-400 mx-4"
          placeholder="e.g., travel, food, business..."
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
        />
        <p className="text-base text-gray-400 leading-relaxed text-center px-4">
          Choose a topic to focus your practice sentences
        </p>
      </div>
      
      {/* Grammar Topics */}
      <div className="space-y-8">
        <label className="block text-lg font-medium text-gray-200 mb-2">
          Grammar Topics <span className="text-red-400">*</span>
        </label>
                    <GrammarTopicSelector 
              selectedTopics={selectedGrammarTopics}
              onTopicsChange={onGrammarTopicsChange}
            />
      </div>
      
      {/* Mode Selection */}
      <div className="space-y-8 pt-6">
        <label className="block text-lg font-medium text-gray-200 text-center mb-4">
          Practice Mode
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                  <button
          className={`mode-selector ${
            mode === "both" ? "mode-selector-active" : "mode-selector-inactive"
          }`}
          onClick={() => onModeChange("both")}
        >
          <div className="mode-selector-title">Mixed Practice</div>
          <div className="mode-selector-subtitle">Both directions</div>
        </button>
        <button
          className={`mode-selector ${
            mode === "es-to-en" ? "mode-selector-active" : "mode-selector-inactive"
          }`}
          onClick={() => onModeChange("es-to-en")}
        >
          <div className="mode-selector-title">Spanish → English</div>
          <div className="mode-selector-subtitle">Listening & translation</div>
        </button>
        <button
          className={`mode-selector ${
            mode === "en-to-es" ? "mode-selector-active" : "mode-selector-inactive"
          }`}
          onClick={() => onModeChange("en-to-es")}
        >
          <div className="mode-selector-title">English → Spanish</div>
          <div className="mode-selector-subtitle">Translation only</div>
        </button>
        </div>
      </div>
      
              {/* Start Button */}
        <div className="pt-8 px-4">
        <button
          className={`btn-large ${
            loading || selectedGrammarTopics.length === 0
              ? "btn-large-disabled"
              : "btn-large-active"
          }`}
          onClick={onStart}
          disabled={loading || selectedGrammarTopics.length === 0}
        >
          {loading ? (
            <>
              <Loader2 className="w-7 h-7 animate-spin" />
              <span>Preparing your session...</span>
            </>
          ) : (
            <>
              <span>Begin Learning Journey</span>
              <Play className="w-6 h-6" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
