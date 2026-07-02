"use client";

import { useEffect, useRef, useState } from "react";
import { Accent, accentClasses } from "../lib/mock";
import { CloseIcon, BookmarkIcon, SendIcon } from "./icons";

export type PopoverState = {
  text: string;
  x: number;
  y: number;
};

type Props = {
  state: PopoverState;
  accent: Accent;
  onClose: () => void;
  onAutoSaved: (text: string) => void;
};

// Anchored inline sub-question card (the "rabbit hole" pattern).
// Includes the 30s auto-save-to-highlights rule from product-vision.md.
export function Popover({ state, accent, onClose, onAutoSaved }: Props) {
  const a = accentClasses[accent];
  const ref = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<
    { role: "agent" | "user"; text: string }[]
  >([
    {
      role: "agent",
      text: `Quick detour on "${truncate(state.text)}". What would you like to know about it?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // 30-second engagement timer → auto-save to highlights.
  useEffect(() => {
    const started = Date.now();
    const id = setInterval(() => {
      const secs = Math.floor((Date.now() - started) / 1000);
      setElapsed(secs);
      if (secs >= 30 && !saved) {
        setSaved(true);
        onAutoSaved(state.text);
      }
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dismiss on click-away / Escape.
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  function send() {
    if (!input.trim()) return;
    const q = input.trim();
    setInput("");
    setMessages((m) => [
      ...m,
      { role: "user", text: q },
      {
        role: "agent",
        text: "Good question — here's the short version, so you can get back to the main thread without losing your place. This is where the scoped sub-answer would appear.",
      },
    ]);
  }

  // Keep the card within the viewport horizontally.
  const left = Math.min(state.x, typeof window !== "undefined" ? window.innerWidth - 380 : state.x);

  return (
    <div
      ref={ref}
      className="animate-pop-in fixed z-50 w-[360px] rounded-2xl border border-line bg-card shadow-float"
      style={{ left: Math.max(16, left), top: state.y + 12 }}
    >
      <div className={`flex items-center gap-2 rounded-t-2xl ${a.soft} px-4 py-2.5`}>
        <span className={`text-[11px] font-bold uppercase tracking-wider ${a.text}`}>
          Rabbit hole
        </span>
        <span className="flex-1" />
        {saved ? (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-sage">
            <BookmarkIcon className="h-3.5 w-3.5" /> Saved
          </span>
        ) : (
          <span className="text-[11px] font-medium text-ink-faint">
            {30 - elapsed > 0 ? `saves in ${30 - elapsed}s` : ""}
          </span>
        )}
        <button
          onClick={onClose}
          className="rounded-lg p-1 text-ink-faint transition hover:bg-black/5 hover:text-ink"
        >
          <CloseIcon className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="max-h-64 space-y-3 overflow-y-auto px-4 py-3">
        <div className={`rounded-lg ${a.soft} px-3 py-2 text-xs italic text-ink-soft`}>
          “{truncate(state.text, 120)}”
        </div>
        {messages.map((m, i) => (
          <div
            key={i}
            className={`text-sm leading-relaxed ${
              m.role === "user"
                ? "ml-6 rounded-2xl rounded-br-md bg-ink px-3 py-2 text-white"
                : "text-ink"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-line px-3 py-2.5">
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask a follow-up…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-faint"
        />
        <button
          onClick={send}
          className={`rounded-lg ${a.bg} p-1.5 text-white transition hover:opacity-90`}
        >
          <SendIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function truncate(s: string, n = 48) {
  return s.length > n ? s.slice(0, n).trimEnd() + "…" : s;
}
