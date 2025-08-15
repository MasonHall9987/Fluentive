"use client";
import { useMemo, useCallback, useState } from 'react';

const GRAMMAR_TOPICS = [
  "present tense",
  "estar vs ser", 
  "present progressive",
  "near future (ir a + infinitive)",
  "Affirmative tú commands (regular)",
  "Affirmative statements (S + V + O)",
  "Preterite",
  "imperfect", 
  "preterite vs imperfect",
  "Present perfect (haber + participle)",
  "Direct object pronouns",
  "Indirect object pronouns", 
  "reflexive",
  "Por vs para",
  "Future simple (hablaré)",
  "Conditional simple (hablaría)",
  "Pluscuamperfecto (había hablado)",
  "Present subjunctive",
  "Double object pronouns",
  "Future perfect"
];

interface GrammarTopicSelectorProps {
  selectedTopics: string[];
  onTopicsChange: (topics: string[]) => void;
}

export const GrammarTopicSelector = ({ selectedTopics, onTopicsChange }: GrammarTopicSelectorProps) => {
  const [grammarSearch, setGrammarSearch] = useState("");

  const filteredGrammarTopics = useMemo(
    () =>
      GRAMMAR_TOPICS.filter(topic =>
        topic.toLowerCase().includes(grammarSearch.toLowerCase())
      ),
    [grammarSearch]
  );

  const toggleGrammarTopic = useCallback((topic: string) => {
    const newTopics = selectedTopics.includes(topic)
      ? selectedTopics.filter(t => t !== topic)
      : [...selectedTopics, topic];
    onTopicsChange(newTopics);
  }, [selectedTopics, onTopicsChange]);

  const clearAllTopics = useCallback(() => {
    onTopicsChange([]);
  }, [onTopicsChange]);

  const selectAllFilteredTopics = useCallback(() => {
    const newTopics = filteredGrammarTopics.filter(topic => !selectedTopics.includes(topic));
    onTopicsChange([...selectedTopics, ...newTopics]);
  }, [filteredGrammarTopics, selectedTopics, onTopicsChange]);

  return (
    <div>
      <label className="text-sm text-white mb-2 block">
        Grammar Topics ({selectedTopics.length} selected)
      </label>
      <input
        className="w-full border rounded px-3 py-2 mb-2"
        placeholder="Search grammar topics..."
        value={grammarSearch}
        onChange={(e) => setGrammarSearch(e.target.value)}
      />
      <div className="flex gap-2 mb-2">
        <button
          className="text-xs border rounded px-2 py-1 text-white hover:bg-gray-800"
          onClick={selectAllFilteredTopics}
          disabled={filteredGrammarTopics.every(topic => selectedTopics.includes(topic))}
        >
          Select All Filtered
        </button>
        <button
          className="text-xs border rounded px-2 py-1 text-white hover:bg-gray-800"
          onClick={clearAllTopics}
          disabled={selectedTopics.length === 0}
        >
          Clear All
        </button>
      </div>
      <div className="max-h-40 overflow-y-auto border rounded p-2 bg-gray-900">
        {filteredGrammarTopics.map(topic => (
          <label key={topic} className="flex items-center space-x-2 py-1 cursor-pointer hover:bg-gray-800 rounded px-2">
            <input
              type="checkbox"
              checked={selectedTopics.includes(topic)}
              onChange={() => toggleGrammarTopic(topic)}
              className="rounded"
            />
            <span className="text-sm text-white">{topic}</span>
          </label>
        ))}
        {filteredGrammarTopics.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-2">No topics match your search</p>
        )}
      </div>
    </div>
  );
};
