"use client";
import { Direction } from '@/lib/types';

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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-500">
          Sentences practiced: {sentencesPracticed} ({direction})
        </div>
        <div className="text-sm text-gray-400">
          Time: {elapsedTime}
        </div>
      </div>
      <div className="flex gap-2">
        <button 
          className="border rounded px-3 py-1 text-red-400 hover:bg-red-900" 
          onClick={onExit}
        >
          Exit
        </button>
        {audioUrl && (
          <>
            <button 
              className="border rounded px-3 py-1 disabled:opacity-50" 
              onClick={() => onPlayAudio(1.0)} 
              disabled={isAudioPlaying}
            >
              Play
            </button>
            <button 
              className="border rounded px-3 py-1 disabled:opacity-50" 
              onClick={() => onPlayAudio(0.5)} 
              disabled={isAudioPlaying}
            >
              Play 0.5x
            </button>
          </>
        )}
      </div>
    </div>
  );
};
