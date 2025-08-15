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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto px-4 py-8 md:px-8 md:py-12 lg:px-12 lg:py-16 animate-fade-in">
        {/* Hero Header with Gradient Text */}
        <div className="text-center mb-12 md:mb-16 lg:mb-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-[var(--mindaro)] via-[var(--light-green)] to-[var(--emerald)] bg-clip-text text-transparent animate-slide-up">
            Fluentive
          </h1>
      <h1 className="text-xl md:text-xl lg:text-2xl font-bold mb-8 animate-slide-up">
            Master languages through immersive translation exercises
          </h1>
        </div>

        {!batchManagement.batch && (
          <div className="flex justify-center">
            <div className="card p-12 md:p-16 lg:p-20 animate-slide-up w-full max-w-4xl mx-auto" style={{ animationDelay: '0.4s' }}>
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
            </div>
          </div>
        )}

        {batchManagement.batch && current && (
          <div className="space-y-8 md:space-y-10 lg:space-y-12 flex flex-col items-center">
            <div className="card p-10 md:p-12 lg:p-14 animate-slide-up w-full max-w-5xl">
              <LessonHeader
                sentencesPracticed={sentencesPracticed}
                direction={batchManagement.batch.direction}
                elapsedTime={timer.elapsedTime}
                onExit={handleExit}
                audioUrl={current.audioUrl}
                onPlayAudio={(rate) => audio.playAudio(current.audioUrl!, rate)}
                isAudioPlaying={Boolean(audio.isAudioPlaying)}
              />
            </div>

            {phase === "transcribe" && current?.audioUrl && (
              <div className="card p-10 md:p-12 lg:p-16 animate-slide-up w-full max-w-5xl">
                <TranscriptionPhase
                  current={current}
                  userTranscription={stt.userTranscription}
                  sttListening={stt.sttListening}
                  validationMsg={validationMsg}
                  transcriptionCorrect={transcriptionCorrect}
                  showTranscriptionHelp={showTranscriptionHelp}
                  transcriptionInputRef={stt.transcriptionInputRef}
                  onTranscriptionChange={stt.setUserTranscription}
                  onSttToggle={() => stt.sttToggle(direction)}
                  onValidateTranscription={handleValidateTranscription}
                  onSkipTranscription={handleSkipTranscription}
                  onProceedToTranslation={handleProceedToTranslation}
                  direction={direction}
                />
              </div>
            )}

            {phase === "translate" && (
              <div className="card p-10 md:p-12 lg:p-16 animate-slide-up w-full max-w-5xl">
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
