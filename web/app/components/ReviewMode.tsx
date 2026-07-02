"use client";

import { Topic, accentClasses } from "../lib/mock";
import { ModeHeader } from "./LearnMode";
import { BookmarkIcon } from "./icons";

export function ReviewMode({ topic }: { topic: Topic }) {
  const a = accentClasses[topic.accent];

  const isEmpty = !topic.summary && topic.highlights.length === 0;
  if (isEmpty) {
    return (
      <div className="flex h-full flex-col">
        <ModeHeader topic={topic} />
        <div className="flex flex-1 items-center justify-center px-7">
          <div className="max-w-sm text-center">
            <div
              className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl ${a.soft} ${a.text}`}
            >
              <BookmarkIcon className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-extrabold">Nothing to review yet</h2>
            <p className="mt-2 text-ink-soft">
              As you learn, a running summary builds here and anything you dwell on
              gets saved as a highlight — automatically. Start a conversation in{" "}
              <span className="font-bold text-ink">Learn</span> and this fills in.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ModeHeader topic={topic} />
      <div className="flex-1 overflow-y-auto px-7 py-8">
        <div className="mx-auto max-w-3xl space-y-10">
          {/* Living summary */}
          <section>
            <div className={`text-[11px] font-bold uppercase tracking-wider ${a.text}`}>
              What you&apos;ve learned
            </div>
            <h2 className="mt-1 mb-4 text-2xl font-extrabold">Topic summary</h2>
            <div className="rounded-3xl border border-line bg-card p-7 shadow-soft">
              {topic.summary.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  className="mb-3 text-[15px] leading-relaxed text-ink last:mb-0"
                  dangerouslySetInnerHTML={{ __html: renderBold(para) }}
                />
              ))}
            </div>
          </section>

          {/* Highlights collection */}
          <section>
            <div className="mb-4 flex items-baseline gap-2">
              <h2 className="text-xl font-extrabold">Highlights</h2>
              <span className="text-sm font-semibold text-ink-faint">
                {topic.highlights.length} saved
              </span>
            </div>
            {topic.highlights.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-line px-6 py-10 text-center text-sm text-ink-faint">
                No highlights yet. Spend 30s in a rabbit hole and they save
                automatically.
              </div>
            ) : (
              <div className="space-y-3">
                {topic.highlights.map((h) => (
                  <div
                    key={h.id}
                    className="group flex gap-3 rounded-2xl border border-line bg-card p-5 shadow-soft transition hover:border-ink-faint/40"
                  >
                    <div className={`mt-0.5 ${a.text}`}>
                      <BookmarkIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[15px] leading-relaxed text-ink">
                        {h.text}
                      </p>
                      {h.note && (
                        <p className="mt-2 text-sm italic text-ink-soft">
                          {h.note}
                        </p>
                      )}
                      <p className="mt-2 text-xs font-semibold text-ink-faint">
                        {h.source}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function renderBold(s: string) {
  return s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}
