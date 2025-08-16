"use client";
import { useState } from 'react';
import { Brain, Plus, Search, Edit3, Trash2, BookOpen, Target, BarChart3 } from 'lucide-react';

interface Word {
  id: string;
  spanish: string;
  english: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lastPracticed?: Date;
  practiceCount: number;
}

export default function VocabularyMode() {
  const [words, setWords] = useState<Word[]>([
    {
      id: '1',
      spanish: 'hola',
      english: 'hello',
      category: 'greetings',
      difficulty: 'beginner',
      practiceCount: 5,
      lastPracticed: new Date('2024-01-15')
    },
    {
      id: '2',
      spanish: 'gracias',
      english: 'thank you',
      category: 'courtesy',
      difficulty: 'beginner',
      practiceCount: 3,
      lastPracticed: new Date('2024-01-14')
    },
    {
      id: '3',
      spanish: 'viajar',
      english: 'to travel',
      category: 'verbs',
      difficulty: 'intermediate',
      practiceCount: 2,
      lastPracticed: new Date('2024-01-10')
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);

  const categories = ['all', 'greetings', 'courtesy', 'verbs', 'nouns', 'adjectives', 'adverbs'];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredWords = words.filter(word => {
    const matchesSearch = word.spanish.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.english.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || word.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || word.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const addWord = (word: Omit<Word, 'id' | 'practiceCount'>) => {
    const newWord: Word = {
      ...word,
      id: Date.now().toString(),
      practiceCount: 0
    };
    setWords([...words, newWord]);
    setShowAddForm(false);
  };

  const updateWord = (id: string, updates: Partial<Word>) => {
    setWords(words.map(word => word.id === id ? { ...word, ...updates } : word));
    setEditingWord(null);
  };

  const deleteWord = (id: string) => {
    setWords(words.filter(word => word.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-6xl mx-auto px-4 py-8 md:px-8 md:py-12 lg:px-12 lg:py-16 animate-fade-in">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="flex items-center gap-4">
            <a 
              href="/" 
              className="text-[var(--indigo-dye)] hover:text-[var(--cerulean)] transition-colors duration-200 flex items-center gap-2 group"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to Home</span>
            </a>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Vocabulary Management</h1>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[var(--indigo-dye)] to-[var(--cerulean)] rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">{words.length}</h3>
            <p className="text-gray-300 text-sm">Total Words</p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[var(--cerulean)] to-[var(--bondi-blue)] rounded-xl flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">{words.filter(w => w.practiceCount > 0).length}</h3>
            <p className="text-gray-300 text-sm">Practiced</p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[var(--bondi-blue)] to-[var(--verdigris)] rounded-xl flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              {Math.round(words.reduce((sum, w) => sum + w.practiceCount, 0) / Math.max(words.length, 1))}
            </h3>
            <p className="text-gray-300 text-sm">Avg Practice</p>
          </div>

          <div className="card p-6 text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[var(--verdigris)] to-[var(--keppel)] rounded-xl flex items-center justify-center mb-4">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">{words.filter(w => w.difficulty === 'advanced').length}</h3>
            <p className="text-gray-300 text-sm">Advanced</p>
          </div>
        </div>

        {/* Controls */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search words..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[var(--indigo-dye)] transition-colors"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-[var(--indigo-dye)] transition-colors"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-slate-800 text-white">
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-[var(--indigo-dye)] transition-colors"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff} className="bg-slate-800 text-white">
                    {diff === 'all' ? 'All Levels' : diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Word Button */}
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--indigo-dye)] to-[var(--cerulean)] text-white font-medium rounded-xl hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              <span>Add Word</span>
            </button>
          </div>
        </div>

        {/* Words List */}
        <div className="card p-6">
          <div className="space-y-4">
            {filteredWords.length === 0 ? (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No words found matching your criteria</p>
                <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredWords.map(word => (
                <div key={word.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-white">{word.spanish}</h3>
                        <p className="text-gray-300">{word.english}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          word.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300' :
                          word.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {word.difficulty}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                          {word.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                      <span>Practiced: {word.practiceCount} times</span>
                      {word.lastPracticed && (
                        <span>Last: {word.lastPracticed.toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingWord(word)}
                      className="p-2 text-[var(--indigo-dye)] hover:text-[var(--cerulean)] transition-colors"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteWord(word.id)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add/Edit Word Modal */}
        {(showAddForm || editingWord) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="card p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-white mb-6">
                {editingWord ? 'Edit Word' : 'Add New Word'}
              </h3>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const wordData = {
                  spanish: formData.get('spanish') as string,
                  english: formData.get('english') as string,
                  category: formData.get('category') as string,
                  difficulty: formData.get('difficulty') as 'beginner' | 'intermediate' | 'advanced'
                };
                
                if (editingWord) {
                  updateWord(editingWord.id, wordData);
                } else {
                  addWord(wordData);
                }
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Spanish</label>
                  <input
                    name="spanish"
                    defaultValue={editingWord?.spanish}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[var(--indigo-dye)]"
                    placeholder="hola"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">English</label>
                  <input
                    name="english"
                    defaultValue={editingWord?.english}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[var(--indigo-dye)]"
                    placeholder="hello"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    name="category"
                    defaultValue={editingWord?.category}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-[var(--indigo-dye)]"
                  >
                    {categories.filter(cat => cat !== 'all').map(cat => (
                      <option key={cat} value={cat} className="bg-slate-800 text-white">
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty</label>
                  <select
                    name="difficulty"
                    defaultValue={editingWord?.difficulty}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-[var(--indigo-dye)]"
                  >
                    {difficulties.filter(diff => diff !== 'all').map(diff => (
                      <option key={diff} value={diff} className="bg-slate-800 text-white">
                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[var(--indigo-dye)] to-[var(--cerulean)] text-white font-medium rounded-xl hover:scale-105 transition-all duration-300"
                  >
                    {editingWord ? 'Update' : 'Add'} Word
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingWord(null);
                    }}
                    className="flex-1 px-6 py-3 bg-gray-600 text-white font-medium rounded-xl hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
