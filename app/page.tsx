"use client";
import { useCallback, useEffect, useState } from "react";
import { Direction } from "@/lib/types";

// Hooks
import { useTimer } from "./hooks/useTimer";
import { useSpeechToText } from "./hooks/useSpeechToText";
import { useAudioPlayback } from "./hooks/useAudioPlayback";
import { useBatchManagement } from "./hooks/useBatchManagement";
import { useTranslationValidation } from "./hooks/useTranslationValidation";
import { useFollowUpQuestions } from "./hooks/useFollowUpQuestions";

// Components
import { SetupForm } from "./components/SetupForm";
import { LessonHeader } from "./components/LessonHeader";
import { TranscriptionPhase } from "./components/TranscriptionPhase";
import { TranslationPhase } from "./components/TranslationPhase";

type Phase = "audio" | "transcribe" | "translate";
type Mode = "both" | Direction;

export default function Home() {
  // Local state
  const [topic, setTopic] = useState("");
  const [selectedGrammarTopics, setSelectedGrammarTopics] = useState<string[]>([]);
  const [mode, setMode] = useState<Mode>("both");
  const [direction, setDirection] = useState<Direction>("es-to-en");
  const [phase, setPhase] = useState<Phase>("transcribe");
  const [sentencesPracticed, setSentencesPracticed] = useState(0);
  const [transcriptionCorrect, setTranscriptionCorrect] = useState(false);
  const [showTranscriptionHelp, setShowTranscriptionHelp] = useState(false);
  const [validationMsg, setValidationMsg] = useState<string | null>(null);

  // Custom hooks
  const timer = useTimer();
  const stt = useSpeechToText();
  const audio = useAudioPlayback();
  const batchManagement = useBatchManagement();
  const translation = useTranslationValidation();
  const followUp = useFollowUpQuestions();

  // Get current sentence
  const current = batchManagement.getCurrentSentence();

  // Reset states when changing sentences
  useEffect(() => {
    if (current) {
      console.log("Resetting states for new sentence:", current.id);
      setPhase(batchManagement.batch?.direction === "es-to-en" ? "transcribe" : "translate");
      stt.resetTranscription();
      translation.resetTranslation();
      followUp.resetFollowUp();
      setTranscriptionCorrect(false);
      setShowTranscriptionHelp(false);
      setValidationMsg(null);
      stt.stopStt();
    }
  }, [current, batchManagement.batch?.direction]); // Remove hook dependencies to prevent infinite loops

  // Event handlers
  const handleStart = useCallback(async () => {
    await batchManagement.requestBatch(topic, selectedGrammarTopics, direction, timer.startTimer);
  }, [batchManagement, topic, selectedGrammarTopics, direction, timer]);

  // Transcription handlers
  const handleValidateTranscription = useCallback(async () => {
    if (!current) return;
    const res = await fetch("/api/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "transcription", expectedText: current.text, userText: stt.userTranscription }),
    });
    const data = await res.json();
    setTranscriptionCorrect(data.isCorrect);
    if (data.isCorrect) {
      setValidationMsg("Correct! Now translate the sentence.");
      setShowTranscriptionHelp(false);
    } else {
      setValidationMsg("Not quite right. Check the highlighted differences below.");
      setShowTranscriptionHelp(true);
    }
  }, [current, stt.userTranscription]);

  const handleSkipTranscription = useCallback(() => {
    setTranscriptionCorrect(true);
    setValidationMsg("Skipped transcription. Here's the correct text:");
    setShowTranscriptionHelp(true);
    const correctText = current?.text || "";
    stt.setUserTranscription(correctText);
    if (stt.transcriptionInputRef.current) {
      stt.transcriptionInputRef.current.textContent = correctText;
    }
  }, [current, stt]);

  const handleProceedToTranslation = useCallback(() => {
    setPhase("translate");
  }, []);

  // Translation handlers  
  const handleValidateTranslation = useCallback(async () => {
    if (!current) return;
    await translation.validateTranslation(
      current.text,
      current.translation,
      direction,
      () => setSentencesPracticed(prev => prev + 1)
    );
  }, [current, direction, translation]);

  const handleSkipTranslation = useCallback(() => {
    if (!current) return;
    translation.skipTranslation(current.translation, () => setSentencesPracticed(prev => prev + 1));
  }, [current, translation]);

  const handleNextSentence = useCallback(() => {
    batchManagement.nextSentence(mode, topic, selectedGrammarTopics, setDirection);
  }, [batchManagement, mode, topic, selectedGrammarTopics]);

  const handleFollowUpQuestion = useCallback(async () => {
    if (!current || !translation.translationResult) return;
    await followUp.handleFollowUpQuestion(
      current.text,
      current.translation,
      translation.userTranslation,
      translation.translationResult.message || '',
      direction
    );
  }, [current, translation, followUp, direction]);

  const handleExit = useCallback(() => {
    timer.resetTimer();
    batchManagement.resetBatch();
    setSentencesPracticed(0);
  }, [timer, batchManagement]);

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-white">Fluentive: Sentence Translation</h1>

      {!batchManagement.batch && (
        <SetupForm
          topic={topic}
          selectedGrammarTopics={selectedGrammarTopics}
          mode={mode}
          loading={batchManagement.loading}
          onTopicChange={setTopic}
          onGrammarTopicsChange={setSelectedGrammarTopics}
          onModeChange={setMode}
          onStart={handleStart}
        />
      )}

      {batchManagement.batch && current && (
        <div className="mt-6 space-y-6">
          <LessonHeader
            sentencesPracticed={sentencesPracticed}
            direction={batchManagement.batch.direction}
            elapsedTime={timer.elapsedTime}
            onExit={handleExit}
            audioUrl={current.audioUrl}
            onPlayAudio={(rate) => audio.playAudio(current.audioUrl!, rate)}
            isAudioPlaying={Boolean(audio.isAudioPlaying)}
          />

          {phase === "transcribe" && current?.audioUrl && (
            <TranscriptionPhase
              current={current}
              userTranscription={stt.userTranscription}
              sttListening={stt.sttListening}
              validationMsg={validationMsg}
              transcriptionCorrect={transcriptionCorrect}
              showTranscriptionHelp={showTranscriptionHelp}
              transcriptionInputRef={stt.transcriptionInputRef}
              onTranscriptionChange={stt.setUserTranscription}
              onSttToggle={stt.sttToggle}
              onValidateTranscription={handleValidateTranscription}
              onSkipTranscription={handleSkipTranscription}
              onProceedToTranslation={handleProceedToTranslation}
              direction={direction}
            />
          )}

          {phase === "translate" && (
            <TranslationPhase
              current={current}
              userTranslation={translation.userTranslation}
              validationMsg={translation.validationMsg}
              translationResult={translation.translationResult}
              showTranslationCorrection={translation.showTranslationCorrection}
              followUpQuestion={followUp.followUpQuestion}
              followUpResponse={followUp.followUpResponse}
              direction={direction}
              onTranslationChange={translation.setUserTranslation}
              onValidateTranslation={handleValidateTranslation}
              onSkipTranslation={handleSkipTranslation}
              onNextSentence={handleNextSentence}
              onRetryTranslation={translation.retryTranslation}
              onPlayAudio={(rate) => audio.playAudio(current.audioUrl!, rate)}
              isAudioPlaying={Boolean(audio.isAudioPlaying)}
              onFollowUpQuestionChange={followUp.setFollowUpQuestion}
              onHandleFollowUpQuestion={handleFollowUpQuestion}
            />
          )}
        </div>
      )}
    </div>
  );
}
