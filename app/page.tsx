"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Direction, SentenceBatch, SentenceItem } from "@/lib/types";

type Phase = "audio" | "transcribe" | "translate" | "result";

const GRAMMAR_TOPICS = [
  "present tense",
  "estar vs ser", 
  "present progressive",
  "near future (ir a + infinitive)",
  "Affirmative tú commands (regular)",
  "Affirmative statements (S + V + O)",
  "Preterite",
  "imperfect", 
  "preterite vs imperfect",
  "Present perfect (haber + participle)",
  "Direct object pronouns",
  "Indirect object pronouns", 
  "reflexive",
  "Por vs para",
  "Future simple (hablaré)",
  "Conditional simple (hablaría)",
  "Pluscuamperfecto (había hablado)",
  "Present subjunctive",
  "Double object pronouns",
  "Future perfect"
];

export default function Home() {
  const [topic, setTopic] = useState("");
  const [selectedGrammarTopics, setSelectedGrammarTopics] = useState<string[]>([]);
  const [grammarSearch, setGrammarSearch] = useState("");
  type Mode = "both" | Direction;
  const [mode, setMode] = useState<Mode>("both");
  const [direction, setDirection] = useState<Direction>("es-to-en");
  const [batch, setBatch] = useState<SentenceBatch | null>(null);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("transcribe");
  const [current, setCurrent] = useState<SentenceItem | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [userTranscription, setUserTranscription] = useState("");
  const [userTranslation, setUserTranslation] = useState("");
  const [validationMsg, setValidationMsg] = useState<string | null>(null);
  const [transcriptionCorrect, setTranscriptionCorrect] = useState(false);
  const [showTranscriptionHelp, setShowTranscriptionHelp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [queuedBatch, setQueuedBatch] = useState<SentenceBatch | null>(null);
  const [sttListening, setSttListening] = useState(false);
  const [audioPlaybackRate, setAudioPlaybackRate] = useState(1.0);
  const recognizerRef = useRef<any>(null);
  const transcriptionInputRef = useRef<HTMLDivElement>(null);

  const filteredGrammarTopics = useMemo(
    () =>
      GRAMMAR_TOPICS.filter(topic =>
        topic.toLowerCase().includes(grammarSearch.toLowerCase())
      ),
    [grammarSearch]
  );

  const toggleGrammarTopic = useCallback((topic: string) => {
    setSelectedGrammarTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  }, []);

  const clearAllTopics = useCallback(() => {
    setSelectedGrammarTopics([]);
  }, []);

  const selectAllFilteredTopics = useCallback(() => {
    setSelectedGrammarTopics(prev => {
      const newTopics = filteredGrammarTopics.filter(topic => !prev.includes(topic));
      return [...prev, ...newTopics];
    });
  }, [filteredGrammarTopics]);

  useEffect(() => {
    if (batch && batch.sentences[index]) {
      setCurrent(batch.sentences[index]);
      setPhase(batch.direction === "es-to-en" ? "transcribe" : "translate");
      setUserTranscription("");
      setUserTranslation("");
      setValidationMsg(null);
      setTranscriptionCorrect(false);
      setShowTranscriptionHelp(false);
      setAudioPlaybackRate(1.0);
      // Clear contentEditable
      if (transcriptionInputRef.current) {
        transcriptionInputRef.current.textContent = "";
      }
      // stop STT if active when sentence changes
      try {
        if (recognizerRef.current) {
          recognizerRef.current.stopContinuousRecognitionAsync?.(() => {
            recognizerRef.current.close?.();
            recognizerRef.current = null;
          }, () => {
            recognizerRef.current = null;
          });
        }
      } catch {}
      setSttListening(false);
    }
  }, [batch, index]);

  const requestBatch = useCallback(async () => {
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
      // Preload next batch in background
      const nextDir: Direction = mode === "both" ? (data.direction === "es-to-en" ? "en-to-es" : "es-to-en") : (mode as Direction);
      void prefetchNextBatch(nextDir);
    } finally {
      setLoading(false);
    }
  }, [topic, selectedGrammarTopics, direction, mode]);

  const prefetchNextBatch = useCallback(async (nextDir: Direction) => {
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
  }, [topic, selectedGrammarTopics]);

  const playAudio = useCallback((playbackRate = audioPlaybackRate) => {
    if (!current || !current.audioUrl) return;
    // Prevent overlapping playback
    if (audio && !audio.ended && !audio.paused) return;
    const audioEl = new Audio(current.audioUrl);
    audioEl.playbackRate = playbackRate;
    setAudio(audioEl);
    audioEl.addEventListener("ended", () => {
      // allow replay after end
    }, { once: true });
    audioEl.play();
  }, [current, audio, audioPlaybackRate]);

  const validateTranscription = useCallback(async () => {
    if (!current) return;
    const res = await fetch("/api/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "transcription", expectedText: current.text, userText: userTranscription }),
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
  }, [current, userTranscription]);

  const skipTranscription = useCallback(() => {
    setTranscriptionCorrect(true);
    setValidationMsg("Skipped transcription. Here's the correct text:");
    setShowTranscriptionHelp(true);
    const correctText = current?.text || "";
    setUserTranscription(correctText);
    if (transcriptionInputRef.current) {
      transcriptionInputRef.current.textContent = correctText;
    }
  }, [current]);

  const proceedToTranslation = useCallback(() => {
    setPhase("translate");
  }, []);

  const renderTranscriptionComparison = useCallback(() => {
    if (!current || !showTranscriptionHelp) return null;
    
    const expected = current.text.toLowerCase().trim();
    const user = userTranscription.toLowerCase().trim();
    
    return (
      <div className="mt-4 p-4 border rounded bg-gray-900">
        <div className="space-y-2">
          <div>
            <span className="text-sm text-gray-300">Your answer: </span>
            <span className="text-white">{userTranscription}</span>
          </div>
          <div>
            <span className="text-sm text-gray-300">Correct answer: </span>
            <span className="text-green-400">{current.text}</span>
          </div>
          {expected !== user && (
            <div className="text-sm text-yellow-300">
              Keep trying! Listen carefully and try again.
            </div>
          )}
        </div>
      </div>
    );
  }, [current, showTranscriptionHelp, userTranscription]);

  const validateTranslation = useCallback(async () => {
    if (!current) return;
    const res = await fetch("/api/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "translation",
        sourceText: current.text,
        expectedTranslation: current.translation,
        userTranslation,
        direction,
      }),
    });
    const data = await res.json();
    setValidationMsg(data.isCorrect ? "Correct!" : data.message || "Check differences");
    setPhase("result");
  }, [current, userTranslation, direction]);

  const renderTextWithDefinitions = useCallback(() => {
    if (!current) return null;
    const text = current.text;
    type Segment = { start: number; end: number; defTitle?: string };
    const marks: Segment[] = [];
    for (const def of current.definitions) {
      for (const occ of def.occurrences) {
        const start = Math.max(0, Math.min(text.length, occ.startIndex));
        const end = Math.max(start, Math.min(text.length, occ.endIndex));
        // Show contextual translation/definition only in tooltip
        marks.push({ start, end, defTitle: `${def.definition}` });
      }
    }
    marks.sort((a, b) => a.start - b.start || b.end - a.end);
    const merged: Segment[] = [];
    for (const m of marks) {
      const last = merged[merged.length - 1];
      if (!last || m.start >= last.end) merged.push(m);
    }
    const segments: Segment[] = [];
    let cursor = 0;
    for (const m of merged) {
      if (cursor < m.start) segments.push({ start: cursor, end: m.start });
      segments.push(m);
      cursor = m.end;
    }
    if (cursor < text.length) segments.push({ start: cursor, end: text.length });
    return (
      <p className="text-white text-3xl sm:text-4xl leading-relaxed font-semibold">
        {segments.map((s, i) => {
          const slice = text.slice(s.start, s.end);
          if (!s.defTitle) return <span key={i}>{slice}</span>;
          return (
            <span key={i} className="relative inline-block group underline decoration-dotted cursor-help">
              {slice}
              <span className="pointer-events-none absolute z-50 -top-9 left-1/2 -translate-x-1/2 whitespace-pre rounded bg-white text-black text-xs px-2 py-1 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition will-change-transform shadow">
                {s.defTitle}
              </span>
            </span>
          );
        })}
      </p>
    );
  }, [current]);

  const nextSentence = useCallback(() => {
    if (!batch) return;
    if (index < batch.sentences.length - 1) {
      setIndex((i) => i + 1);
    } else {
      // Move to queued batch if available, otherwise fetch fresh nextDir based on mode
      const fallbackDirection: Direction = mode === "both" ? (batch.direction === "es-to-en" ? "en-to-es" : "es-to-en") : (mode as Direction);
      if (queuedBatch) {
        setBatch(queuedBatch);
        setDirection(queuedBatch.direction);
        setQueuedBatch(null);
        setIndex(0);
        const nextDir: Direction = mode === "both" ? (queuedBatch.direction === "es-to-en" ? "en-to-es" : "es-to-en") : (mode as Direction);
        void prefetchNextBatch(nextDir);
      } else {
        setDirection(fallbackDirection);
        requestBatch();
      }
    }
  }, [batch, index, queuedBatch, requestBatch, prefetchNextBatch, mode]);

  const sttToggle = useCallback(async () => {
    try {
      const sdk: any = await import("microsoft-cognitiveservices-speech-sdk");
      if (sttListening && recognizerRef.current) {
        await new Promise<void>((resolve) => {
          recognizerRef.current.stopContinuousRecognitionAsync(() => {
            recognizerRef.current.close();
            recognizerRef.current = null;
            resolve();
          }, () => resolve());
        });
        setSttListening(false);
        return;
      }
      const tokenRes = await fetch("/api/stt/token");
      if (!tokenRes.ok) throw new Error("Token error");
      const { token, region } = await tokenRes.json();
      const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(token, region);
      speechConfig.speechRecognitionLanguage = direction === "es-to-en" ? "es-ES" : "en-US";
      const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
      const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
      recognizer.recognizing = (_s: any, e: any) => {
        if (e?.result?.text) {
          setUserTranscription(e.result.text);
          if (transcriptionInputRef.current) {
            transcriptionInputRef.current.textContent = e.result.text;
          }
        }
      };
      recognizer.recognized = (_s: any, e: any) => {
        if (e?.result?.text) {
          setUserTranscription(e.result.text);
          if (transcriptionInputRef.current) {
            transcriptionInputRef.current.textContent = e.result.text;
          }
        }
      };
      recognizer.canceled = () => {};
      recognizer.sessionStopped = () => {
        setSttListening(false);
        recognizer.close();
        recognizerRef.current = null;
      };
      await new Promise<void>((resolve) => {
        recognizer.startContinuousRecognitionAsync(() => resolve(), () => resolve());
      });
      recognizerRef.current = recognizer;
      setSttListening(true);
    } catch (e) {
      console.error(e);
    }
  }, [direction, sttListening]);

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-white">Fluentive: Sentence Translation</h1>

      {!batch && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded px-3 py-2"
              placeholder="Optional topic (e.g., travel)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-white mb-2 block">Grammar Topics ({selectedGrammarTopics.length} selected)</label>
            <input
              className="w-full border rounded px-3 py-2 mb-2"
              placeholder="Search grammar topics..."
              value={grammarSearch}
              onChange={(e) => setGrammarSearch(e.target.value)}
            />
            <div className="flex gap-2 mb-2">
              <button
                className="text-xs border rounded px-2 py-1 text-white hover:bg-gray-800"
                onClick={selectAllFilteredTopics}
                disabled={filteredGrammarTopics.every(topic => selectedGrammarTopics.includes(topic))}
              >
                Select All Filtered
              </button>
              <button
                className="text-xs border rounded px-2 py-1 text-white hover:bg-gray-800"
                onClick={clearAllTopics}
                disabled={selectedGrammarTopics.length === 0}
              >
                Clear All
              </button>
            </div>
            <div className="max-h-40 overflow-y-auto border rounded p-2 bg-gray-900">
              {filteredGrammarTopics.map(topic => (
                <label key={topic} className="flex items-center space-x-2 py-1 cursor-pointer hover:bg-gray-800 rounded px-2">
                  <input
                    type="checkbox"
                    checked={selectedGrammarTopics.includes(topic)}
                    onChange={() => toggleGrammarTopic(topic)}
                    className="rounded"
                  />
                  <span className="text-sm text-white">{topic}</span>
                </label>
              ))}
              {filteredGrammarTopics.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-2">No topics match your search</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm">Mode:</label>
            <select
              className="border rounded px-2 py-1"
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
            >
              <option value="both">Both (flip every batch)</option>
              <option value="es-to-en">Spanish → English only</option>
              <option value="en-to-es">English → Spanish only</option>
            </select>
          </div>
          <button
            className="bg-white text-black rounded px-4 py-2 disabled:opacity-50"
            onClick={requestBatch}
            disabled={loading || selectedGrammarTopics.length === 0}
          >
            {loading ? "Loading..." : "Start"}
          </button>
        </div>
      )}

      {batch && current && (
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Sentence {index + 1} of {batch.sentences.length} ({batch.direction})
            </div>
            {current?.audioUrl && (
              <div className="flex gap-2">
                <button className="border rounded px-3 py-1 disabled:opacity-50" onClick={() => playAudio(1.0)} disabled={Boolean(audio && !audio.ended && !audio.paused)}>
                  Play
                </button>
                <button className="border rounded px-3 py-1 disabled:opacity-50" onClick={() => playAudio(0.5)} disabled={Boolean(audio && !audio.ended && !audio.paused)}>
                  Play 0.5x
                </button>
              </div>
            )}
          </div>

          {phase === "transcribe" && current?.audioUrl && (
            <div className="space-y-4">
              <div className="text-gray-300 text-sm">Listen and type what you hear:</div>
              
              <div className="relative">
                <div
                  ref={transcriptionInputRef}
                  contentEditable
                  className="text-white text-3xl sm:text-4xl leading-relaxed font-semibold border-2 border-gray-600 rounded p-4 min-h-[120px] focus:outline-none focus:border-blue-500"
                  style={{ lineHeight: "1.5" }}
                  onInput={(e) => setUserTranscription(e.currentTarget.textContent || "")}
                  suppressContentEditableWarning={true}
                />
                {!userTranscription && (
                  <div className="absolute top-4 left-4 text-gray-500 text-3xl sm:text-4xl pointer-events-none">
                    Click here and type what you hear...
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <button className={`border rounded px-3 py-2 ${sttListening ? 'bg-red-600 text-white' : ''}`} onClick={sttToggle}>
                  {sttListening ? "Stop Recording" : "🎤 Record"}
                </button>
                <button className="bg-blue-600 text-white rounded px-4 py-2" onClick={validateTranscription}>
                  Check Transcription
                </button>
                <button className="border rounded px-3 py-2" onClick={skipTranscription}>
                  Skip
                </button>
              </div>
              
              {validationMsg && <p className="text-sm text-gray-200">{validationMsg}</p>}
              
              {renderTranscriptionComparison()}
              
              {transcriptionCorrect && (
                <div className="text-center">
                  <button className="bg-green-600 text-white rounded px-6 py-3" onClick={proceedToTranslation}>
                    Continue to Translation →
                  </button>
                </div>
              )}
            </div>
          )}

          {phase === "translate" && (
            <div className="space-y-2">
              {renderTextWithDefinitions()}
              <input
                className="w-full border rounded px-3 py-2"
                placeholder={`Translate to ${direction === "es-to-en" ? "English" : "Spanish"}`}
                value={userTranslation}
                onChange={(e) => setUserTranslation(e.target.value)}
              />
              <button className="bg-white text-black rounded px-4 py-2" onClick={validateTranslation}>Check translation</button>
            </div>
          )}

          {phase === "result" && (
            <div className="space-y-3">
              {validationMsg && <p className="text-sm text-gray-200">{validationMsg}</p>}
              <p className="text-gray-300 text-sm">Correct translation: <span className="font-medium text-white">{current.translation}</span></p>
              <div className="flex gap-2">
                <button className="border rounded px-3 py-2" onClick={() => setPhase("translate")}>Try again</button>
                <button className="bg-white text-black rounded px-4 py-2" onClick={nextSentence}>Next sentence</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
