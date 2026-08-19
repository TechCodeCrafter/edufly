// Voice hooks built on the browser Web Speech API.
//   useSpeechToText  -> press to talk, get a live transcript (SpeechRecognition)
//   useTextToSpeech  -> read interviewer questions out loud (speechSynthesis)
// Both feature-detect and degrade gracefully: if the browser does not support
// the API, `supported` is false and the UI hides the voice affordances.

import { useCallback, useEffect, useRef, useState } from 'react';

// ----------------------------- typing for the vendor-prefixed API -----------------------------

interface SpeechRecognitionResultLike {
  0: { transcript: string };
  isFinal: boolean;
  length: number;
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: { length: number; [i: number]: SpeechRecognitionResultLike };
}
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

// ----------------------------- speech to text -----------------------------

export interface SpeechToText {
  supported: boolean;
  listening: boolean;
  transcript: string; // final + interim, live
  error: string | null;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useSpeechToText(): SpeechToText {
  const [supported] = useState(() => getRecognitionCtor() !== null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const finalRef = useRef(''); // accumulates only finalized chunks
  const wantListeningRef = useRef(false); // keep alive across auto-stops

  useEffect(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;
    const rec = new Ctor();
    rec.lang = 'en-US';
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    rec.onstart = () => setListening(true);
    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        const text = r[0].transcript;
        if (r.isFinal) finalRef.current += text + ' ';
        else interim += text;
      }
      setTranscript((finalRef.current + interim).trimStart());
    };
    rec.onerror = (e) => {
      // 'no-speech' and 'aborted' are routine, not real failures.
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setError('Microphone access was blocked. Allow it in your browser to use voice.');
        wantListeningRef.current = false;
      } else if (e.error === 'audio-capture') {
        setError('No microphone was found.');
        wantListeningRef.current = false;
      }
    };
    rec.onend = () => {
      // Chrome auto-stops after a pause. If the user still wants to talk, restart.
      if (wantListeningRef.current) {
        try {
          rec.start();
          return;
        } catch {
          /* fallthrough */
        }
      }
      setListening(false);
    };

    recRef.current = rec;
    return () => {
      wantListeningRef.current = false;
      try {
        rec.abort();
      } catch {
        /* ignore */
      }
      recRef.current = null;
    };
  }, []);

  const start = useCallback(() => {
    if (!recRef.current) return;
    setError(null);
    wantListeningRef.current = true;
    try {
      recRef.current.start();
    } catch {
      // start() throws if already started; that is fine.
    }
  }, []);

  const stop = useCallback(() => {
    wantListeningRef.current = false;
    try {
      recRef.current?.stop();
    } catch {
      /* ignore */
    }
    setListening(false);
  }, []);

  const reset = useCallback(() => {
    finalRef.current = '';
    setTranscript('');
  }, []);

  return { supported, listening, transcript, error, start, stop, reset };
}

// ----------------------------- text to speech -----------------------------

export interface TextToSpeech {
  supported: boolean;
  speaking: boolean;
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  speak: (text: string) => void;
  cancel: () => void;
}

export function useTextToSpeech(): TextToSpeech {
  const [supported] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);
  const [speaking, setSpeaking] = useState(false);
  const [enabled, setEnabled] = useState(supported);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  // Pick a natural-sounding English voice once the list loads.
  useEffect(() => {
    if (!supported) return;
    const pick = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      const prefer = ['Google US English', 'Samantha', 'Microsoft Aria', 'Microsoft Jenny', 'Daniel'];
      voiceRef.current =
        prefer.map((n) => voices.find((v) => v.name === n)).find(Boolean) ||
        voices.find((v) => v.lang === 'en-US') ||
        voices.find((v) => v.lang.startsWith('en')) ||
        voices[0] ||
        null;
    };
    pick();
    window.speechSynthesis.onvoiceschanged = pick;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [supported]);

  const cancel = useCallback(() => {
    if (!supported) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* ignore */
    }
    setSpeaking(false);
  }, [supported]);

  const speak = useCallback(
    (text: string) => {
      if (!supported || !enabled || !text.trim()) return;
      try {
        window.speechSynthesis.cancel(); // never overlap
        const u = new SpeechSynthesisUtterance(text);
        if (voiceRef.current) u.voice = voiceRef.current;
        u.rate = 1.0;
        u.pitch = 1.0;
        u.onstart = () => setSpeaking(true);
        u.onend = () => setSpeaking(false);
        u.onerror = () => setSpeaking(false);
        window.speechSynthesis.speak(u);
      } catch {
        setSpeaking(false);
      }
    },
    [supported, enabled]
  );

  // Stop any speech if the component using this unmounts.
  useEffect(() => () => cancel(), [cancel]);

  return { supported, speaking, enabled, setEnabled, speak, cancel };
}
