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

const VERB_TYPES = [
  "irregular",
  "regular", 
  "reflexive"
];

interface GrammarTopicSelectorProps {
  selectedTopics: string[];
  onTopicsChange: (topics: string[]) => void;
  selectedVerbTypes: string[];
  onVerbTypesChange: (verbTypes: string[]) => void;
}

export const GrammarTopicSelector = ({ 
  selectedTopics, 
  onTopicsChange, 
  selectedVerbTypes, 
  onVerbTypesChange 
}: GrammarTopicSelectorProps) => {
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

  const toggleVerbType = useCallback((verbType: string) => {
    const newVerbTypes = selectedVerbTypes.includes(verbType)
      ? selectedVerbTypes.filter(t => t !== verbType)
      : [...selectedVerbTypes, verbType];
    onVerbTypesChange(newVerbTypes);
  }, [selectedVerbTypes, onVerbTypesChange]);

  return (
    <div className="space-y-8">
      {/* Search Input + Selected Pills */}
      <div className="space-y-6">
        {/* Tag Input with Selected Pills */}
        <div className="relative w-full mx-4">
          <div className="modern-input min-h-[35px] p-2 flex items-center gap-2 overflow-x-auto tag-input-container">
            {/* Selected Topic Pills */}
            {selectedTopics.length > 0 && (
              <div className="flex items-center gap-2 flex-shrink-0">
                {selectedTopics.map(topic => (
                  <button
                    key={topic}
                    onClick={() => toggleGrammarTopic(topic)}
                    className="topic-pill-selected"
                  >
                    <span className="whitespace-nowrap">{topic}</span>
                    <X className="w-3 h-3" />
                  </button>
                ))}
              </div>
            )}
            
            {/* Search Input */}
            <input
              className="flex-1 min-w-[200px] bg-transparent border-none outline-none text-white text-base placeholder:text-gray-400 px-2 py-1"
              placeholder={selectedTopics.length === 0 ? "Search and select grammar topics..." : "Search more topics..."}
              value={grammarSearch}
              onChange={(e) => setGrammarSearch(e.target.value)}
            />
          </div>
        </div>
        
        {/* Action Buttons + Instructions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4">
          <div className="flex flex-wrap gap-3">
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
            
            {/* Verb Type Buttons */}
            <div className="flex gap-2 items-center">
              <span className="text-gray-400 text-sm font-medium">Verbs:</span>
              {VERB_TYPES.map(verbType => (
                <button
                  key={verbType}
                  className={`modern-btn ${
                    selectedVerbTypes.includes(verbType) 
                      ? 'status-correct text-white hover:scale-105' 
                      : 'modern-btn-action'
                  }`}
                  onClick={() => toggleVerbType(verbType)}
                >
                  <span className="capitalize">{verbType}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col items-end text-sm text-gray-400">
            <span>{selectedTopics.length} of {GRAMMAR_TOPICS.length} selected</span>
            <span>Select at least one grammar topic to practice</span>
          </div>
        </div>
      </div>

      {/* Available Topics */}
      <div className="space-y-6" style={{ margin: "10px" }}>
        <div className="max-h-80 min-h-80 overflow-y-auto pr-2">
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
