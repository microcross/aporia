"use client";

import { useState, useCallback } from "react";
import { topics, accentClasses } from "./lib/mock";
import { TopicRail } from "./components/TopicRail";
import { LearnMode } from "./components/LearnMode";
import { ReviewMode } from "./components/ReviewMode";
import { PracticeMode } from "./components/PracticeMode";
import { ToastStack, ToastData } from "./components/Toast";
import { LearnIcon, ReviewIcon, PracticeIcon } from "./components/icons";

type Mode = "learn" | "review" | "practice";

const MODES: { id: Mode; label: string; icon: typeof LearnIcon }[] = [
  { id: "learn", label: "Learn", icon: LearnIcon },
  { id: "review", label: "Review", icon: ReviewIcon },
  { id: "practice", label: "Practice", icon: PracticeIcon },
];

export default function Home() {
  const [activeSlug, setActiveSlug] = useState(topics[0].slug);
  const [mode, setMode] = useState<Mode>("learn");
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const topic = topics.find((t) => t.slug === activeSlug)!;
  const a = accentClasses[topic.accent];

  const pushToast = useCallback((t: Omit<ToastData, "id">) => {
    setToasts((prev) => [...prev, { ...t, id: Date.now() + Math.random() }]);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleHighlightSaved = useCallback(
    (text: string) => {
      pushToast({
        emoji: "🔖",
        title: "Highlight saved",
        body:
          text.length > 50
            ? `“${text.slice(0, 50).trimEnd()}…” added`
            : `“${text}” added`,
      });
    },
    [pushToast]
  );

  const handlePracticeComplete = useCallback(() => {
    pushToast({
      emoji: "⭐️",
      title: "+40 XP · Level up!",
      body: `You reached Level ${topic.level + 1} in ${topic.name}.`,
    });
    setMode("learn");
  }, [pushToast, topic]);

  return (
    <div className="flex h-full">
      <TopicRail
        topics={topics}
        activeSlug={activeSlug}
        onSelect={(slug) => {
          setActiveSlug(slug);
          setMode("learn");
        }}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        {/* Mode switcher */}
        <div className="flex items-center justify-center border-b border-line bg-card/40 px-7 py-3">
          <div className="flex gap-1 rounded-2xl bg-line/60 p-1">
            {MODES.map((m) => {
              const active = mode === m.id;
              const Icon = m.icon;
              const due = m.id === "practice" && topic.dueReviews > 0;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
                    active
                      ? `bg-card shadow-soft ${a.text}`
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {m.label}
                  {due && <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-h-0 flex-1">
          {mode === "learn" && (
            <LearnMode
              key={topic.slug}
              topic={topic}
              onHighlightSaved={handleHighlightSaved}
            />
          )}
          {mode === "review" && <ReviewMode key={topic.slug} topic={topic} />}
          {mode === "practice" && (
            <PracticeMode
              key={topic.slug}
              topic={topic}
              onComplete={handlePracticeComplete}
            />
          )}
        </div>
      </main>

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
