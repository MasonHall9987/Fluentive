"use client";
import { Direction } from '@/lib/types';
import { GrammarTopicSelector } from './GrammarTopicSelector';

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
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder="Optional topic (e.g., travel)"
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
        />
      </div>
      
      <GrammarTopicSelector 
        selectedTopics={selectedGrammarTopics}
        onTopicsChange={onGrammarTopicsChange}
      />
      
      <div className="flex items-center gap-3">
        <label className="text-sm">Mode:</label>
        <select
          className="border rounded px-2 py-1"
          value={mode}
          onChange={(e) => onModeChange(e.target.value as Mode)}
        >
          <option value="both">Both (flip every batch)</option>
          <option value="es-to-en">Spanish → English only</option>
          <option value="en-to-es">English → Spanish only</option>
        </select>
      </div>
      
      <button
        className="bg-white text-black rounded px-4 py-2 disabled:opacity-50"
        onClick={onStart}
        disabled={loading || selectedGrammarTopics.length === 0}
      >
        {loading ? "Loading..." : "Start"}
      </button>
    </div>
  );
};
