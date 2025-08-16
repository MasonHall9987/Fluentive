"use client";
import { Mic, MessageSquare, Volume2, Users } from 'lucide-react';

export default function LiveSimulationMode() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-6xl mx-auto px-4 py-8 md:px-8 md:py-12 lg:px-12 lg:py-16 animate-fade-in">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="flex items-center gap-4">
            <a 
              href="/" 
              className="text-[var(--bondi-blue)] hover:text-[var(--lapis-lazuli)] transition-colors duration-200 flex items-center gap-2 group"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to Home</span>
            </a>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Live Simulation Mode</h1>
        </div>

        {/* Coming Soon Section */}
        <div className="text-center space-y-8 animate-slide-up">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[var(--bondi-blue)] to-[var(--lapis-lazuli)] rounded-full flex items-center justify-center">
            <Mic className="w-16 h-16 text-white" />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Coming Soon!</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Real-time conversation practice with AI partners and pronunciation feedback
            </p>
          </div>

          {/* Feature Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="card p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[var(--bondi-blue)] to-[var(--verdigris)] rounded-xl flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">AI Conversation Partners</h3>
              <p className="text-gray-300 text-sm">Practice with intelligent AI that adapts to your level</p>
            </div>

            <div className="card p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[var(--verdigris)] to-[var(--keppel)] rounded-xl flex items-center justify-center">
                <Volume2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Pronunciation Assessment</h3>
              <p className="text-gray-300 text-sm">Get real-time feedback on your speaking</p>
            </div>

            <div className="card p-6 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[var(--keppel)] to-[var(--emerald)] rounded-xl flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Role-Playing Scenarios</h3>
              <p className="text-gray-300 text-sm">Practice real-world conversations and situations</p>
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="pt-8">
            <a 
              href="/" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[var(--bondi-blue)] to-[var(--lapis-lazuli)] text-white font-medium rounded-xl hover:scale-105 transition-all duration-300"
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
