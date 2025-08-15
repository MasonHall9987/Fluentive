import { useState, useCallback } from 'react';
import { Direction } from '@/lib/types';

export const useFollowUpQuestions = () => {
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [followUpResponse, setFollowUpResponse] = useState<string | null>(null);

  const handleFollowUpQuestion = useCallback(async (
    sentence: string,
    translation: string,
    userTranslation: string,
    explanation: string,
    direction: Direction
  ) => {
    if (!followUpQuestion.trim()) return;
    
    try {
      const response = await fetch('/api/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: followUpQuestion,
          sentence,
          translation,
          userTranslation,
          explanation,
          direction
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setFollowUpResponse(data.response);
      }
    } catch (error) {
      console.error('Follow-up question failed:', error);
    }
  }, [followUpQuestion]);

  const resetFollowUp = useCallback(() => {
    setFollowUpQuestion("");
    setFollowUpResponse(null);
  }, []);

  return {
    followUpQuestion,
    setFollowUpQuestion,
    followUpResponse,
    handleFollowUpQuestion,
    resetFollowUp
  };
};
