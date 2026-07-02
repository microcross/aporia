"use client";

import { useEffect } from "react";

export type ToastData = {
  id: number;
  emoji: string;
  title: string;
  body: string;
};

export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastData[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[60] flex flex-col gap-3">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastData;
  onDismiss: (id: number) => void;
}) {
  useEffect(() => {
    const id = setTimeout(() => onDismiss(toast.id), 4200);
    return () => clearTimeout(id);
  }, [toast.id, onDismiss]);

  return (
    <div className="animate-toast-up pointer-events-auto flex w-80 items-start gap-3 rounded-2xl border border-line bg-card p-4 shadow-float">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-soft text-xl">
        {toast.emoji}
      </div>
      <div className="flex-1">
        <p className="text-sm font-extrabold">{toast.title}</p>
        <p className="mt-0.5 text-sm text-ink-soft">{toast.body}</p>
      </div>
    </div>
  );
}
