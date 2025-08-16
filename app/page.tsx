"use client";
import { BookOpen, Mic, Zap, Brain, Settings } from 'lucide-react';
import sdapi from "sdapi"



export default function Home() {
  const test = async () => {
    const result = await sdapi.translate('chimba')
    console.log(result)
  }
  test()
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto px-4 py-8 md:px-8 md:py-12 lg:px-12 lg:py-16 animate-fade-in">
        {/* Hero Header */}
        <div className="text-center mb-16 md:mb-20 lg:mb-24">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-[var(--mindaro)] via-[var(--light-green)] to-[var(--emerald)] bg-clip-text text-transparent animate-slide-up">
            Fluentive
          </h1>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-300 mb-6 animate-slide-up">
            Master languages through immersive exercises
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto animate-slide-up">
            Choose your learning path and dive into interactive language practice
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          
          {/* Translation Mode */}
          <a href="/translation" className="group">
            <div className="card p-8 md:p-10 lg:p-12 h-full hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[var(--mindaro)] to-[var(--emerald)] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Translation Mode</h3>
                  <p className="text-gray-300 text-base leading-relaxed">
                    Practice listening, transcription, and translation with AI-generated sentences
                  </p>
                </div>
                <div className="pt-4">
                  <span className="inline-flex items-center gap-2 text-[var(--mindaro)] font-medium group-hover:gap-3 transition-all duration-300">
                    Start Learning
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </a>

          {/* Live Simulation Mode */}
          <a href="/live-simulation" className="group">
            <div className="card p-8 md:p-10 lg:p-12 h-full hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[var(--bondi-blue)] to-[var(--lapis-lazuli)] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mic className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Live Simulation</h3>
                  <p className="text-gray-300 text-base leading-relaxed">
                    Real-time conversation practice with AI partners and pronunciation feedback
                  </p>
                </div>
                <div className="pt-4">
                  <span className="inline-flex items-center gap-2 text-[var(--bondi-blue)] font-medium group-hover:gap-3 transition-all duration-300">
                    Start Speaking
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </a>

          {/* Verb Conjugation Mode */}
          <a href="/verb-conjugation" className="group">
            <div className="card p-8 md:p-10 lg:p-12 h-full hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[var(--verdigris)] to-[var(--keppel)] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Verb Conjugation</h3>
                  <p className="text-gray-300 text-base leading-relaxed">
                    Master verb forms across tenses, moods, and irregular patterns
                  </p>
                </div>
                <div className="pt-4">
                  <span className="inline-flex items-center gap-2 text-[var(--verdigris)] font-medium group-hover:gap-3 transition-all duration-300">
                    Practice Verbs
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </a>

          {/* Vocabulary Mode */}
          <a href="/vocab" className="group">
            <div className="card p-8 md:p-10 lg:p-12 h-full hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[var(--indigo-dye)] to-[var(--cerulean)] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Vocabulary</h3>
                  <p className="text-gray-300 text-base leading-relaxed">
                    Build and manage your word lists with spaced repetition learning
                  </p>
                </div>
                <div className="pt-4">
                  <span className="inline-flex items-center gap-2 text-[var(--indigo-dye)] font-medium group-hover:gap-3 transition-all duration-300">
                    Manage Words
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </a>

          {/* Settings */}
          <a href="/settings" className="group">
            <div className="card p-8 md:p-10 lg:p-12 h-full hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Settings className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Settings</h3>
                  <p className="text-gray-300 text-base leading-relaxed">
                    Configure your learning preferences and manage account settings
                  </p>
                </div>
                <div className="pt-4">
                  <span className="inline-flex items-center gap-2 text-gray-400 font-medium group-hover:gap-3 transition-all duration-300">
                    Configure
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </a>

        </div>

        {/* Footer Info */}
        <div className="text-center mt-16 md:mt-20 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <p className="text-gray-400 text-sm">
            Choose a mode to begin your language learning journey
          </p>
        </div>
      </div>
    </div>
  );
}
