"use client";
import { Zap, Clock, BookOpen, Target } from 'lucide-react';

export default function VerbConjugationMode() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-6xl mx-auto px-4 py-8 md:px-8 md:py-12 lg:px-12 lg:py-16 animate-fade-in">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="flex items-center gap-4">
            <a 
              href="/" 
              className="text-[var(--verdigris)] hover:text-[var(--keppel)] transition-colors duration-200 flex items-center gap-2 group"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to Home</span>
            </a>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Verb Conjugation Mode</h1>
        </div>

        {/* Coming Soon Section */}
        <div className="text-center space-y-8 animate-slide-up">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[var(--verdigris)] to-[var(--keppel)] rounded-full flex items-center justify-center">
            <Zap className="w-16 h-16 text-white" />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Coming Soon!</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Master verb forms across tenses, moods, and irregular patterns
            </p>
          </div>

          {/* Feature Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="card p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[var(--verdigris)] to-[var(--emerald)] rounded-xl flex items-center justify-center">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">All Tenses</h3>
              <p className="text-gray-300 text-sm">Present, past, future, conditional, and subjunctive</p>
            </div>

            <div className="card p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[var(--emerald)] to-[var(--mindaro)] rounded-xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Verb Categories</h3>
              <p className="text-gray-300 text-sm">Regular, irregular, reflexive, and stem-changing verbs</p>
            </div>

            <div className="card p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[var(--mindaro)] to-[var(--light-green)] rounded-xl flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Smart Practice</h3>
              <p className="text-gray-300 text-sm">AI-generated exercises based on your weak areas</p>
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="pt-8">
            <a 
              href="/" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[var(--verdigris)] to-[var(--keppel)] text-white font-medium rounded-xl hover:scale-105 transition-all duration-300"
            >
              <span>Back to Home</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
