"use client";
import { useMemo, useCallback, useState } from 'react';
import { Search, X, Plus, Trash2 } from 'lucide-react';

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
    <div className="space-y-8">
      {/* Search Input + Selected Pills */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <input
              className="modern-input w-full pl-16 pr-8 py-6 text-lg mx-4"
              placeholder="Search grammar topics..."
              value={grammarSearch}
              onChange={(e) => setGrammarSearch(e.target.value)}
            />
          </div>
          
          {/* Selected Topic Pills */}
          {selectedTopics.length > 0 && (
            <div className="flex flex-wrap gap-2 px-4 lg:px-0 lg:max-w-md">
              {selectedTopics.map(topic => (
                <button
                  key={topic}
                  onClick={() => toggleGrammarTopic(topic)}
                  className="topic-pill status-correct text-white shadow-lg hover:shadow-xl"
                >
                  <span>{topic}</span>
                  <X className="w-5 h-5 opacity-75" />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Action Buttons + Instructions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4">
          <div className="flex gap-4">
            <button
              className="modern-btn modern-btn-action"
              onClick={selectAllFilteredTopics}
              disabled={filteredGrammarTopics.every(topic => selectedTopics.includes(topic))}
            >
              <Plus className="w-5 h-5" />
              <span>Select Filtered</span>
            </button>
            <button
              className="modern-btn modern-btn-danger"
              onClick={clearAllTopics}
              disabled={selectedTopics.length === 0}
            >
              <Trash2 className="w-5 h-5" />
              <span>Clear All</span>
            </button>
          </div>
          
          <div className="flex flex-col items-end text-sm text-gray-400">
            <span>{selectedTopics.length} of {GRAMMAR_TOPICS.length} selected</span>
            <span>Select at least one grammar topic to practice</span>
          </div>
        </div>
      </div>

      {/* Available Topics */}
      <div className="space-y-6">
        <h4 className="text-base font-medium text-gray-200 uppercase tracking-wide text-center">
          Available Topics
        </h4>
        <div className="max-h-80 overflow-y-auto pr-2">
          <div className="flex flex-wrap gap-4 justify-center px-4">
            {filteredGrammarTopics
              .filter(topic => !selectedTopics.includes(topic))
              .map(topic => (
                <button
                  key={topic}
                  onClick={() => toggleGrammarTopic(topic)}
                  className="topic-pill topic-pill-available"
                >
                  <Plus className="w-4 h-4" />
                  <span>{topic}</span>
                </button>
              ))
            }
          </div>
          
          {filteredGrammarTopics.filter(topic => !selectedTopics.includes(topic)).length === 0 && (
            <div className="text-center py-16">
              {grammarSearch ? (
                <div className="space-y-6">
                  <p className="text-gray-400 text-lg">No topics match "{grammarSearch}"</p>
                  <button
                    onClick={() => setGrammarSearch("")}
                    className="modern-btn modern-btn-action mx-auto"
                  >
                    <X className="w-5 h-5" />
                    <span>Clear search</span>
                  </button>
                </div>
              ) : (
                <p className="text-gray-400 text-lg">All topics selected!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
