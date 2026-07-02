"use client";

import { useState } from "react";
import { Topic, accentClasses } from "../lib/mock";
import { ModeHeader } from "./LearnMode";

const RATINGS = [
  { label: "Forgot", value: 1, color: "text-coral", bg: "hover:bg-coral-soft" },
  { label: "Hard", value: 2, color: "text-amber", bg: "hover:bg-amber-soft" },
  { label: "Good", value: 3, color: "text-sky", bg: "hover:bg-sky-soft" },
  { label: "Easy", value: 4, color: "text-sage", bg: "hover:bg-sage-soft" },
];

export function PracticeMode({
  topic,
  onComplete,
}: {
  topic: Topic;
  onComplete: () => void;
}) {
  const a = accentClasses[topic.accent];
  const cards = topic.reviews;
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);

  if (cards.length === 0 || done) {
    return (
      <div className="flex h-full flex-col">
        <ModeHeader topic={topic} />
        <div className="flex flex-1 items-center justify-center px-7">
          <div className="text-center">
            <div
              className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl ${a.soft} text-3xl`}
            >
              {topic.isNew ? "🌱" : "🎉"}
            </div>
            <h2 className="text-2xl font-extrabold">
              {topic.isNew ? "No cards yet" : "All caught up"}
            </h2>
            <p className="mt-2 max-w-sm text-ink-soft">
              {topic.isNew
                ? "Concepts you learn become spaced-repetition cards here, scheduled so they resurface right before you'd forget."
                : cards.length === 0
                  ? "Nothing due for review right now. Come back when concepts resurface."
                  : "You cleared every review due for this topic. Nice momentum."}
            </p>
            {done && (
              <button
                onClick={onComplete}
                className={`mt-6 rounded-2xl ${a.bg} px-6 py-3 text-sm font-bold text-white transition hover:opacity-90`}
              >
                Back to learning
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const card = cards[idx];

  function rate() {
    if (idx + 1 >= cards.length) {
      setDone(true);
    } else {
      setIdx((i) => i + 1);
      setRevealed(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <ModeHeader topic={topic} />
      <div className="flex flex-1 flex-col items-center justify-center px-7 pb-10">
        {/* progress dots */}
        <div className="mb-8 flex gap-1.5">
          {cards.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? `w-8 ${a.bg}` : i < idx ? "w-1.5 bg-ink-faint" : "w-1.5 bg-line"
              }`}
            />
          ))}
        </div>

        <div className="w-full max-w-xl">
          <div className="rounded-3xl border border-line bg-card p-9 shadow-float">
            <div className={`text-[11px] font-bold uppercase tracking-wider ${a.text}`}>
              {card.concept}
              {card.daysOverdue > 0 && (
                <span className="ml-2 font-semibold text-ink-faint">
                  · {card.daysOverdue}d overdue
                </span>
              )}
            </div>
            <p className="mt-3 text-xl font-bold leading-snug">{card.prompt}</p>

            {revealed ? (
              <div className="mt-6 animate-pop-in border-t border-line pt-5">
                <p className="text-[15px] leading-relaxed text-ink-soft">
                  {card.answer}
                </p>
              </div>
            ) : (
              <p className="mt-6 text-sm text-ink-faint">
                Try to recall the answer before revealing it.
              </p>
            )}
          </div>

          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="mt-5 w-full rounded-2xl bg-ink py-3.5 text-sm font-bold text-white transition hover:opacity-90"
            >
              Reveal answer
            </button>
          ) : (
            <div className="mt-5">
              <p className="mb-2 text-center text-xs font-semibold text-ink-faint">
                How well did you know it?
              </p>
              <div className="grid grid-cols-4 gap-2">
                {RATINGS.map((r) => (
                  <button
                    key={r.value}
                    onClick={rate}
                    className={`rounded-2xl border border-line bg-card py-3 text-sm font-bold ${r.color} ${r.bg} transition`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
