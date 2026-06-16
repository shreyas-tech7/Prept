"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Square, Loader2, Keyboard, Send, AudioLines } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";

interface VoiceRecorderProps {
  onSubmit: (answer: string) => Promise<void>;
  disabled?: boolean;
}

function getSpeechRecognition(): typeof SpeechRecognition | undefined {
  if (typeof window === "undefined") return undefined;
  return window.SpeechRecognition || window.webkitSpeechRecognition;
}

function countWords(s: string) {
  const t = s.trim();
  return t ? t.split(/\s+/).length : 0;
}

export function VoiceRecorder({ onSubmit, disabled }: VoiceRecorderProps) {
  const { toast } = useToast();
  const [supported, setSupported] = useState<boolean | null>(null);
  const [recording, setRecording] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [typeMode, setTypeMode] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [textValue, setTextValue] = useState("");

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalRef = useRef(""); // text committed across restarts
  const sessionFinalRef = useRef(""); // final text from the current recognition run
  const listeningRef = useRef(false);

  useEffect(() => {
    const SR = getSpeechRecognition();
    setSupported(!!SR);
    if (!SR) setTypeMode(true);
    return () => {
      listeningRef.current = false;
      recognitionRef.current?.abort();
    };
  }, []);

  const startRecording = useCallback(() => {
    const SR = getSpeechRecognition();
    if (!SR) {
      setTypeMode(true);
      return;
    }

    finalRef.current = "";
    sessionFinalRef.current = "";
    setTranscript("");

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let sessionFinal = "";
      let interim = "";
      for (let i = 0; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) sessionFinal += res[0].transcript;
        else interim += res[0].transcript;
      }
      sessionFinalRef.current = sessionFinal;
      setTranscript((finalRef.current + sessionFinal + interim).trimStart());
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "no-speech" || event.error === "aborted") return;
      toast({
        variant: "error",
        title: "Voice input issue",
        description:
          "We couldn't access the mic. You can type your answer instead.",
      });
      listeningRef.current = false;
      setRecording(false);
      setTypeMode(true);
    };

    recognition.onend = () => {
      // Commit this run's final text, and keep listening if the user hasn't stopped.
      finalRef.current = (finalRef.current + sessionFinalRef.current).replace(
        /\s+/g,
        " "
      );
      sessionFinalRef.current = "";
      if (listeningRef.current) {
        try {
          recognition.start();
        } catch {
          /* already starting */
        }
      }
    };

    listeningRef.current = true;
    try {
      recognition.start();
      recognitionRef.current = recognition;
      setRecording(true);
    } catch {
      toast({
        variant: "error",
        title: "Couldn't start recording",
        description: "Try typing your answer instead.",
      });
      setTypeMode(true);
    }
  }, [toast]);

  const stopAndSubmit = useCallback(async () => {
    listeningRef.current = false;
    recognitionRef.current?.stop();
    const answer = (finalRef.current + sessionFinalRef.current).trim() ||
      transcript.trim();
    setRecording(false);

    if (!answer) {
      toast({
        variant: "error",
        title: "No answer captured",
        description: "We didn't hear anything. Try again or type your answer.",
      });
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(answer);
    } finally {
      setSubmitting(false);
    }
  }, [onSubmit, toast, transcript]);

  const submitText = useCallback(async () => {
    const answer = textValue.trim();
    if (!answer) {
      toast({
        variant: "error",
        title: "Empty answer",
        description: "Write a few sentences before submitting.",
      });
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(answer);
    } finally {
      setSubmitting(false);
    }
  }, [onSubmit, textValue, toast]);

  // ---- Processing state ----
  if (submitting) {
    return (
      <div className="flex min-h-[340px] flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-amber-400" />
        <p className="font-display text-xl">Coaching your answer…</p>
        <p className="max-w-xs text-sm text-[#9492A4]">
          Claude is scoring your response and writing specific feedback.
        </p>
        {transcript && (
          <p className="mt-2 max-h-28 max-w-md overflow-y-auto rounded-lg border border-[#2A2A3C] bg-[#0F0F16] p-3 text-left text-xs text-[#9492A4]">
            {transcript}
          </p>
        )}
      </div>
    );
  }

  // ---- Type mode ----
  if (typeMode) {
    return (
      <div className="flex flex-col gap-4">
        {supported === false && (
          <p className="rounded-lg border border-[#2A2A3C] bg-[#1C1C27] px-4 py-2 text-xs text-[#9492A4]">
            Voice input isn&apos;t supported in this browser — type your answer
            below. (Tip: Chrome works best for voice.)
          </p>
        )}
        <Textarea
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          placeholder="Type your answer here, as if you were speaking it aloud…"
          className="min-h-[200px]"
          disabled={disabled}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#9492A4]">
            {countWords(textValue)} words
          </span>
          <div className="flex gap-2">
            {supported && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setTypeMode(false)}
              >
                <Mic className="h-4 w-4" />
                Use voice
              </Button>
            )}
            <Button onClick={submitText} disabled={disabled}>
              <Send className="h-4 w-4" />
              Submit answer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ---- Recording state (spotlight) ----
  if (recording) {
    return (
      <div className="recording-spotlight flex flex-col items-center gap-6 rounded-xl py-6">
        <button
          onClick={stopAndSubmit}
          className="relative flex h-24 w-24 items-center justify-center rounded-full bg-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-transform hover:scale-105"
          aria-label="Stop and submit"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-amber-500/40" />
          <AudioLines className="relative h-9 w-9 text-black" />
        </button>

        <p className="text-sm text-amber-200/80">Listening… speak naturally</p>

        <div className="min-h-[96px] w-full rounded-lg border border-[#2A2A3C] bg-[#0F0F16] p-4 text-sm leading-relaxed text-[#D6D5DE]">
          {transcript || (
            <span className="text-[#9492A4]">
              Your words will appear here as you speak…
            </span>
          )}
        </div>

        <div className="flex w-full items-center justify-between">
          <span className="text-xs text-[#9492A4]">
            {countWords(transcript)} words
          </span>
          <Button variant="destructive" onClick={stopAndSubmit}>
            <Square className="h-4 w-4" />
            Stop &amp; submit
          </Button>
        </div>
      </div>
    );
  }

  // ---- Idle state ----
  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <button
        onClick={startRecording}
        disabled={disabled}
        className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#2A2A3C] bg-[#1C1C27] text-[#F1F0EE] transition hover:border-amber-500/50 hover:text-amber-400 disabled:opacity-50"
        aria-label="Start recording"
      >
        <Mic className="h-9 w-9" />
      </button>
      <div className="text-center">
        <p className="font-display text-xl">Click to start speaking</p>
        <p className="mt-1 text-sm text-[#9492A4]">
          Answer out loud, just like a real interview.
        </p>
      </div>
      <Button onClick={startRecording} disabled={disabled} size="lg">
        <Mic className="h-4 w-4" />
        Start recording
      </Button>

      <button
        onClick={() => setTypeMode(true)}
        className="flex items-center gap-1.5 text-sm text-[#9492A4] transition hover:text-[#F1F0EE]"
      >
        <Keyboard className="h-4 w-4" />
        or type your answer instead
      </button>
    </div>
  );
}
