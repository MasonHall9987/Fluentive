"use client";
import { Direction } from '@/lib/types';
import { BarChart3, Clock, LogOut, Volume2, Turtle } from 'lucide-react';

interface LessonHeaderProps {
  sentencesPracticed: number;
  direction: Direction;
  elapsedTime: string;
  onExit: () => void;
  audioUrl?: string;
  onPlayAudio: (rate: number) => void;
  isAudioPlaying: boolean;
}

export const LessonHeader = ({
  sentencesPracticed,
  direction,
  elapsedTime,
  onExit,
  audioUrl,
  onPlayAudio,
  isAudioPlaying
}: LessonHeaderProps) => {
  return (
    <div className="space-y-8 md:space-y-10">
      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {/* Sentences Practiced */}
        <div className="glass p-8 md:p-10 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-[var(--keppel)]" />
            <div className="text-base text-gray-400 uppercase tracking-wide font-medium">
              Progress
            </div>
          </div>
          <div className="text-4xl md:text-5xl font-bold text-white mb-3">
            {sentencesPracticed}
          </div>
          <div className="text-base text-gray-300">
            sentences practiced
          </div>
        </div>

        {/* Practice Mode */}
        <div className="glass p-8 md:p-10 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-[var(--emerald)]" />
            <div className="text-base text-gray-400 uppercase tracking-wide font-medium">
              Mode
            </div>
          </div>
          <div className="text-xl font-semibold text-white mb-3 flex items-center gap-3">
            <span className="px-3 py-2 bg-yellow-400/20 text-yellow-300 rounded-lg text-base">
              {direction === "es-to-en" ? "ES" : "EN"}
            </span>
            <span className="text-gray-400 text-lg">→</span>
            <span className="px-3 py-2 bg-blue-400/20 text-blue-300 rounded-lg text-base">
              {direction === "es-to-en" ? "EN" : "ES"}
            </span>
          </div>
          <div className="text-base text-gray-300">
            {direction === "es-to-en" ? "Spanish → English" : "English → Spanish"}
          </div>
        </div>

        {/* Time Elapsed */}
        <div className="glass p-8 md:p-10 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-[var(--light-green)]" />
            <div className="text-base text-gray-400 uppercase tracking-wide font-medium">
              Session Time
            </div>
          </div>
          <div className="text-3xl md:text-4xl font-mono font-semibold text-white mb-3">
            {elapsedTime}
          </div>
          <div className="text-base text-gray-300">
            elapsed time
          </div>
        </div>

        {/* Actions */}
        <div className="glass p-8 md:p-10 rounded-2xl flex flex-col justify-center">
          <button 
            className="btn-danger w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-lg font-medium hover:scale-105 transition-all duration-300" 
            onClick={onExit}
          >
            <LogOut className="w-6 h-6" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Audio Controls */}
      {audioUrl && (
        <div className="flex justify-center pt-4">
          <div className="flex gap-6 p-6 glass rounded-2xl">
            <button 
              className={`btn-audio ${
                isAudioPlaying ? "btn-audio-disabled" : "btn-audio-primary"
              }`}
              onClick={() => onPlayAudio(1.0)} 
              disabled={isAudioPlaying}
            >
              <Volume2 className="w-6 h-6" />
              <span>Play</span>
            </button>
            <button 
              className={`btn-audio ${
                isAudioPlaying ? "btn-audio-disabled" : "btn-audio-secondary"
              }`}
              onClick={() => onPlayAudio(0.5)} 
              disabled={isAudioPlaying}
            >
              <Turtle className="w-6 h-6" />
              <span>Slow</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
