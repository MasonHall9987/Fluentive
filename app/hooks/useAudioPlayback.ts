import { useState, useRef, useCallback } from 'react';

export const useAudioPlayback = () => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [audioPlaybackRate, setAudioPlaybackRate] = useState(1.0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = useCallback((audioUrl: string, playbackRate = audioPlaybackRate) => {
    if (!audioUrl) return;
    
    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    const audioEl = new Audio(audioUrl);
    audioEl.playbackRate = playbackRate;
    audioRef.current = audioEl;
    setAudio(audioEl);
    audioEl.addEventListener("ended", () => {
      setAudio(null);
    }, { once: true });
    audioEl.play();
  }, [audioPlaybackRate]);

  const isAudioPlaying = audio && !audio.ended && !audio.paused;

  return {
    audio,
    audioPlaybackRate,
    setAudioPlaybackRate,
    playAudio,
    isAudioPlaying
  };
};
