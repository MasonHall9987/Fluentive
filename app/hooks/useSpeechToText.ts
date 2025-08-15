import { useState, useRef, useCallback, useEffect } from 'react';
import { Direction } from '@/lib/types';

export const useSpeechToText = () => {
  const [sttListening, setSttListening] = useState(false);
  const [userTranscription, setUserTranscription] = useState("");
  const recognizerRef = useRef<any>(null);
  const transcriptionInputRef = useRef<HTMLDivElement>(null);
  const sttListeningRef = useRef<boolean>(false);
  const setUserTranscriptionRef = useRef<typeof setUserTranscription>();

  // Keep refs in sync with state and setters
  useEffect(() => {
    sttListeningRef.current = sttListening;
    setUserTranscriptionRef.current = setUserTranscription;
    console.log("STT listening state changed to:", sttListening);
  }, [sttListening]);

  const sttToggle = useCallback(async (direction: Direction) => {
    try {
      const sdk: any = await import("microsoft-cognitiveservices-speech-sdk");
      
      // Use ref to get current listening state to avoid stale closure
      if (sttListeningRef.current && recognizerRef.current) {
        console.log("Stopping STT...");
        await new Promise<void>((resolve) => {
          recognizerRef.current.stopContinuousRecognitionAsync(() => {
            recognizerRef.current.close();
            recognizerRef.current = null;
            resolve();
          }, () => resolve());
        });
        setSttListening(false);
        console.log("STT stopped");
        return;
      }
      
      console.log("Starting STT...");
      const tokenRes = await fetch("/api/stt/token");
      if (!tokenRes.ok) throw new Error("Token error");
      const { token, region } = await tokenRes.json();
      console.log("Got token and region:", region);
      
      const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(token, region);
      speechConfig.speechRecognitionLanguage = direction === "es-to-en" ? "es-ES" : "en-US";
      console.log("Language set to:", speechConfig.speechRecognitionLanguage);
      
      // Request microphone permission first
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Browser does not support microphone access. Please use HTTPS or a compatible browser.");
      }
      
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log("Microphone permission granted");
      } catch (micError) {
        throw new Error("Microphone access denied. Please allow microphone access and try again.");
      }
      
      const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
      const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
      
      recognizer.recognizing = (_s: any, e: any) => {
        console.log("Recognizing:", e?.result?.text);
        if (e?.result?.text && setUserTranscriptionRef.current) {
          setUserTranscriptionRef.current(e.result.text);
          if (transcriptionInputRef.current) {
            transcriptionInputRef.current.textContent = e.result.text;
          }
        }
      };
      
      recognizer.recognized = (_s: any, e: any) => {
        console.log("Recognized:", e?.result?.text);
        if (e?.result?.text && setUserTranscriptionRef.current) {
          setUserTranscriptionRef.current(e.result.text);
          if (transcriptionInputRef.current) {
            transcriptionInputRef.current.textContent = e.result.text;
          }
        }
      };
      
      recognizer.canceled = (s: any, e: any) => {
        console.log("Recognition canceled:", e);
      };
      
      recognizer.sessionStopped = () => {
        console.log("Session stopped");
        setSttListening(false);
        recognizer.close();
        recognizerRef.current = null;
      };
      
      await new Promise<void>((resolve, reject) => {
        recognizer.startContinuousRecognitionAsync(
          () => {
            console.log("Recognition started successfully");
            resolve();
          }, 
          (err: any) => {
            console.error("Failed to start recognition:", err);
            reject(err);
          }
        );
      });
      
      recognizerRef.current = recognizer;
      setSttListening(true);
      console.log("STT listening set to true, should update UI now");
    } catch (e) {
      console.error("STT Error:", e);
      setSttListening(false);
    }
  }, []); // Use ref to avoid stale closure, no dependencies needed

  const stopStt = useCallback(() => {
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync?.(() => {
        recognizerRef.current.close?.();
        recognizerRef.current = null;
      }, () => {
        recognizerRef.current = null;
      });
    }
    setSttListening(false);
  }, []);

  const resetTranscription = useCallback(() => {
    setUserTranscription("");
    if (transcriptionInputRef.current) {
      transcriptionInputRef.current.textContent = "";
    }
  }, []);

  return {
    sttListening,
    userTranscription,
    setUserTranscription,
    transcriptionInputRef,
    sttToggle,
    stopStt,
    resetTranscription
  };
};
