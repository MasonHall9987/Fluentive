import { useState, useCallback } from 'react';
import { Direction, SentenceBatch } from '@/lib/types';

type Mode = "both" | Direction;

export const useBatchManagement = () => {
  const [batch, setBatch] = useState<SentenceBatch | null>(null);
  const [queuedBatch, setQueuedBatch] = useState<SentenceBatch | null>(null);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const requestBatch = useCallback(async (
    topic: string | undefined,
    selectedGrammarTopics: string[],
    direction: Direction,
    onTimerStart?: () => void
  ) => {
    setLoading(true);
    try {
      const res = await fetch("/api/sentence-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic || undefined, grammarTopics: selectedGrammarTopics, direction }),
      });
      if (!res.ok) throw new Error("Failed to get batch");
      const data = (await res.json()) as SentenceBatch;
      setBatch(data);
      setIndex(0);
      
      // Start timer if first batch
      if (onTimerStart) {
        onTimerStart();
      }
      
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const prefetchNextBatch = useCallback(async (
    topic: string | undefined,
    selectedGrammarTopics: string[],
    nextDir: Direction
  ) => {
    try {
      const res = await fetch("/api/sentence-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic || undefined, grammarTopics: selectedGrammarTopics, direction: nextDir }),
      });
      if (!res.ok) return;
      const data = (await res.json()) as SentenceBatch;
      setQueuedBatch(data);
    } catch {
      // ignore prefetch errors
    }
  }, []);

  const nextSentence = useCallback((
    mode: Mode,
    topic: string | undefined,
    selectedGrammarTopics: string[],
    setDirection: (dir: Direction) => void
  ) => {
    if (!batch) return;
    
    // Since batch size is now 1, always get a new sentence
    const fallbackDirection: Direction = mode === "both" 
      ? (batch.direction === "es-to-en" ? "en-to-es" : "es-to-en") 
      : (mode as Direction);
    
    if (queuedBatch) {
      setBatch(queuedBatch);
      setDirection(queuedBatch.direction);
      setQueuedBatch(null);
      setIndex(0);
      const nextDir: Direction = mode === "both" 
        ? (queuedBatch.direction === "es-to-en" ? "en-to-es" : "es-to-en") 
        : (mode as Direction);
      void prefetchNextBatch(topic, selectedGrammarTopics, nextDir);
    } else {
      setDirection(fallbackDirection);
      requestBatch(topic, selectedGrammarTopics, fallbackDirection);
    }
  }, [batch, queuedBatch, requestBatch, prefetchNextBatch]);

  const resetBatch = useCallback(() => {
    setBatch(null);
    setQueuedBatch(null);
    setIndex(0);
    setLoading(false);
  }, []);

  const getCurrentSentence = () => {
    return batch?.sentences[index] || null;
  };

  return {
    batch,
    queuedBatch,
    index,
    loading,
    requestBatch,
    prefetchNextBatch,
    nextSentence,
    resetBatch,
    getCurrentSentence
  };
};
