"use client";

import { useState } from "react";
import {
  Topic,
  accentClasses,
  sampleConversation,
  samplePaper,
  starterPrompts,
} from "../lib/mock";
import { Popover, PopoverState } from "./Popover";
import { SendIcon, CloseIcon, PlusIcon, SparkIcon } from "./icons";

type Props = {
  topic: Topic;
  onHighlightSaved: (text: string) => void;
};

export function LearnMode({ topic, onHighlightSaved }: Props) {
  const a = accentClasses[topic.accent];
  const [paperOpen, setPaperOpen] = useState(true);
  const [popover, setPopover] = useState<PopoverState | null>(null);
  const [messages] = useState(sampleConversation);

  // Selecting text anywhere in the reading/chat surface opens the anchored pop-over.
  function handleMouseUp() {
    const sel = window.getSelection();
    const text = sel?.toString().trim();
    if (!text || text.length < 3) return;
    const range = sel!.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    setPopover({
      text,
      x: rect.left,
      y: rect.bottom,
    });
  }

  if (topic.isNew) {
    return <EmptyLearnState topic={topic} />;
  }

  return (
    <div className="flex h-full flex-col" onMouseUp={handleMouseUp}>
      <ModeHeader topic={topic}>
        {!paperOpen && (
          <button
            onClick={() => setPaperOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft transition hover:border-ink-soft"
          >
            <PlusIcon className="h-3.5 w-3.5" /> Show paper
          </button>
        )}
      </ModeHeader>

      <div className="flex min-h-0 flex-1">
        {/* Reading pane — slides in only when a source is in play */}
        {paperOpen && (
          <div className="animate-slide-in-right flex w-[46%] shrink-0 flex-col border-r border-line">
            <div className="flex items-start gap-3 border-b border-line px-7 py-5">
              <div className="flex-1">
                <div className={`text-[11px] font-bold uppercase tracking-wider ${a.text}`}>
                  Reading together
                </div>
                <h2 className="mt-1 text-lg font-extrabold leading-snug">
                  {samplePaper.title}
                </h2>
                <p className="mt-0.5 text-xs text-ink-soft">
                  {samplePaper.authors}
                </p>
                <p className="text-xs text-ink-faint">{samplePaper.venue}</p>
              </div>
              <button
                onClick={() => setPaperOpen(false)}
                className="rounded-lg p-1.5 text-ink-faint transition hover:bg-black/5 hover:text-ink"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 space-y-6 overflow-y-auto px-7 py-6">
              {samplePaper.sections.map((s) => (
                <div key={s.heading}>
                  <h3 className="mb-1.5 text-sm font-bold text-ink-soft">
                    {s.heading}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-ink selection:bg-amber-soft">
                    {s.body}
                  </p>
                </div>
              ))}
              <p className="pt-2 text-center text-xs text-ink-faint">
                Select any sentence to open a rabbit hole ↑
              </p>
            </div>
          </div>
        )}

        {/* Chat pane — expands to fill when the paper is hidden */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1 space-y-5 overflow-y-auto px-7 py-6">
            <div className="mx-auto max-w-2xl space-y-5">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={
                    m.role === "user" ? "flex justify-end" : "flex justify-start"
                  }
                >
                  {m.role === "agent" ? (
                    <div className="max-w-[85%] space-y-3">
                      {m.content.split("\n\n").map((para, i) => (
                        <p
                          key={i}
                          className="text-[15px] leading-relaxed text-ink selection:bg-amber-soft"
                        >
                          {para}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <div
                      className={`max-w-[85%] rounded-3xl rounded-br-lg ${a.soft} px-4 py-2.5 text-[15px] leading-relaxed`}
                    >
                      {m.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="px-7 pb-6 pt-2">
            <div className="mx-auto flex max-w-2xl items-center gap-2 rounded-2xl border border-line bg-card px-4 py-2.5 shadow-soft">
              <input
                placeholder="Answer, or ask anything…"
                className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-ink-faint"
              />
              <button className={`rounded-xl ${a.bg} p-2 text-white transition hover:opacity-90`}>
                <SendIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {popover && (
        <Popover
          state={popover}
          accent={topic.accent}
          onClose={() => setPopover(null)}
          onAutoSaved={onHighlightSaved}
        />
      )}
    </div>
  );
}

// First-run experience for a brand-new topic: no source, no history.
// Low-friction, single-input welcome per product-vision.md ("just start talking").
function EmptyLearnState({ topic }: { topic: Topic }) {
  const a = accentClasses[topic.accent];
  return (
    <div className="flex h-full flex-col">
      <ModeHeader topic={topic}>
        <span className={`rounded-full ${a.soft} ${a.text} px-3 py-1 text-xs font-bold`}>
          New topic
        </span>
      </ModeHeader>

      <div className="flex flex-1 items-center justify-center overflow-y-auto px-7 py-10">
        <div className="w-full max-w-xl text-center">
          <div
            className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl ${a.soft} ${a.text}`}
          >
            <SparkIcon className="h-8 w-8" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight">
            Let&apos;s explore {topic.name}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
            Nothing here yet — and that&apos;s the fun part. Tell me where you&apos;d
            like to begin, and I&apos;ll meet you at your level. No quiz, no setup.
          </p>

          {/* Primary input */}
          <div className="mt-8">
            <div className="flex items-center gap-2 rounded-2xl border border-line bg-card px-4 py-3 shadow-soft">
              <input
                autoFocus
                placeholder={`What would you like to understand about ${topic.name.toLowerCase()}?`}
                className="flex-1 bg-transparent text-[15px] outline-none placeholder:text-ink-faint"
              />
              <button
                className={`rounded-xl ${a.bg} p-2 text-white transition hover:opacity-90`}
              >
                <SendIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Starter suggestions */}
          <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
            {starterPrompts.map((s) => (
              <button
                key={s.title}
                className="group rounded-2xl border border-line bg-card/60 p-4 text-left transition hover:border-ink-faint/40 hover:bg-card hover:shadow-soft"
              >
                <div className="text-xl">{s.emoji}</div>
                <div className="mt-2 text-sm font-bold leading-tight">
                  {s.title}
                </div>
                <div className="mt-1 text-xs leading-snug text-ink-faint">
                  {s.sub}
                </div>
              </button>
            ))}
          </div>

          <p className="mt-8 text-xs text-ink-faint">
            Highlights, summaries, and reviews will fill in as you learn.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ModeHeader({
  topic,
  children,
}: {
  topic: Topic;
  children?: React.ReactNode;
}) {
  const a = accentClasses[topic.accent];
  return (
    <div className="flex items-center gap-3 border-b border-line px-7 py-4">
      <span className={`h-3 w-3 rounded-full ${a.dot}`} />
      <h1 className="text-base font-extrabold">{topic.name}</h1>
      <span className="flex-1" />
      {children}
    </div>
  );
}
