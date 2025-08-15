import { useState, useRef, useEffect, useCallback } from 'react';

export const useTimer = () => {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>("00:00");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (startTime && !timerRef.current) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        setElapsedTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [startTime]);

  const startTimer = useCallback(() => {
    if (!startTime) {
      setStartTime(Date.now());
    }
  }, [startTime]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setStartTime(null);
    setElapsedTime("00:00");
  }, []);

  return {
    elapsedTime,
    startTimer,
    resetTimer
  };
};
