"use client";

import { Topic, accentClasses, LEVEL_LABELS } from "../lib/mock";
import { PlusIcon, SparkIcon } from "./icons";

type Props = {
  topics: Topic[];
  activeSlug: string;
  onSelect: (slug: string) => void;
};

export function TopicRail({ topics, activeSlug, onSelect }: Props) {
  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-line bg-card/60">
      <div className="flex items-center gap-2 px-6 pt-6 pb-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-coral text-white">
          <SparkIcon className="h-5 w-5" />
        </div>
        <span className="text-xl font-extrabold tracking-tight">Aporia</span>
      </div>

      <div className="px-4">
        <button className="flex w-full items-center gap-2 rounded-2xl border border-dashed border-line px-4 py-3 text-sm font-semibold text-ink-soft transition hover:border-coral hover:text-coral">
          <PlusIcon className="h-4 w-4" />
          New topic
        </button>
      </div>

      <div className="mt-5 px-6 pb-2 text-xs font-bold uppercase tracking-wider text-ink-faint">
        Your library
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6">
        {topics.map((t) => {
          const a = accentClasses[t.accent];
          const active = t.slug === activeSlug;
          return (
            <button
              key={t.slug}
              onClick={() => onSelect(t.slug)}
              className={`group flex w-full flex-col gap-2 rounded-2xl px-3 py-3 text-left transition ${
                active ? "bg-card shadow-soft" : "hover:bg-card/70"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${a.dot}`} />
                <span className="flex-1 truncate text-sm font-bold">
                  {t.name}
                </span>
                {t.dueReviews > 0 && (
                  <span
                    className={`shrink-0 rounded-full ${a.soft} ${a.text} px-2 py-0.5 text-[11px] font-bold`}
                  >
                    {t.dueReviews} due
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 pl-5">
                <span className="text-[11px] font-semibold text-ink-faint">
                  Lv {t.level} · {LEVEL_LABELS[t.level - 1]}
                </span>
                <span className="text-[11px] text-ink-faint">·</span>
                <span className="text-[11px] text-ink-faint">
                  {t.lastSession}
                </span>
              </div>
              <div className="ml-5 h-1.5 overflow-hidden rounded-full bg-line">
                <div
                  className={`h-full rounded-full ${a.bg}`}
                  style={{ width: `${(t.level / 5) * 100}%` }}
                />
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
