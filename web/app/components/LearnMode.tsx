"use client";

import { useState } from "react";
import {
  Topic,
  accentClasses,
  sampleConversation,
  samplePaper,
} from "../lib/mock";
import { Popover, PopoverState } from "./Popover";
import { SendIcon, CloseIcon, PlusIcon } from "./icons";

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
