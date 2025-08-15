import { useState, useCallback } from 'react';
import { Direction, ValidationResponseBody } from '@/lib/types';

export const useTranslationValidation = () => {
  const [userTranslation, setUserTranslation] = useState("");
  const [validationMsg, setValidationMsg] = useState<string | null>(null);
  const [translationResult, setTranslationResult] = useState<ValidationResponseBody | null>(null);
  const [showTranslationCorrection, setShowTranslationCorrection] = useState(false);

  const validateTranslation = useCallback(async (
    sourceText: string,
    expectedTranslation: string,
    direction: Direction,
    onSuccess?: () => void
  ) => {
    const res = await fetch("/api/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "translation",
        sourceText,
        expectedTranslation,
        userTranslation,
        direction,
      }),
    });
    
    const data = await res.json();
    setTranslationResult(data);
    
    let message = "";
    if (data.isCorrect && data.isNatural !== false) {
      message = "Correct!";
    } else if (data.isCorrect && data.isNatural === false) {
      message = "Correct! But it could sound more natural:";
    } else {
      message = data.message || "Not quite right. Check the correct translation:";
    }
    
    setValidationMsg(message);
    setShowTranslationCorrection(!data.isCorrect || data.isNatural === false);
    
    if (data.isCorrect && onSuccess) {
      onSuccess();
    }
    
    return data;
  }, [userTranslation]);

  const skipTranslation = useCallback((correctTranslation: string, onSkip?: () => void) => {
    setUserTranslation(correctTranslation);
    setTranslationResult({ 
      isCorrect: false, 
      message: "Skipped. Here's the correct translation:", 
      isNatural: true 
    });
    setValidationMsg("Skipped. Here's the correct translation:");
    setShowTranslationCorrection(true);
    
    if (onSkip) {
      onSkip();
    }
  }, []);

  const resetTranslation = useCallback(() => {
    setUserTranslation("");
    setValidationMsg(null);
    setTranslationResult(null);
    setShowTranslationCorrection(false);
  }, []);

  const retryTranslation = useCallback(() => {
    setTranslationResult(null);
    setShowTranslationCorrection(false);
    setValidationMsg(null);
    setUserTranslation("");
  }, []);

  return {
    userTranslation,
    setUserTranslation,
    validationMsg,
    translationResult,
    showTranslationCorrection,
    validateTranslation,
    skipTranslation,
    resetTranslation,
    retryTranslation
  };
};
