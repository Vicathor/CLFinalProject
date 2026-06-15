"use client";

import { Flag, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { formatAskDate } from "@/lib/ask";
import type { AskAnswer } from "@/types/ask";

type AnswerCardProps = {
  answer: AskAnswer;
};

export function AnswerCard({ answer }: Readonly<AnswerCardProps>) {
  const [reported, setReported] = useState(false);

  return (
    <article className="rounded-lg border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-semibold text-zinc-800 dark:text-[#e7edeb]">
            {answer.authorName}
          </span>
          {answer.verified ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-teal-50 dark:bg-teal-950 px-2 py-0.5 text-xs font-semibold text-teal-700 dark:text-teal-400">
              <ShieldCheck className="size-3.5" />
              Verified
            </span>
          ) : null}
        </div>
        <span className="shrink-0 text-xs text-zinc-400 dark:text-[#7e908c]">
          {formatAskDate(answer.createdAt)}
        </span>
      </div>

      <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-[#9fb0ad]">{answer.body}</p>

      {reported ? (
        <p className="mt-3 text-xs font-medium text-zinc-400 dark:text-[#7e908c]">
          Reported — a moderator will review this.
        </p>
      ) : (
        <button
          type="button"
          onClick={() => setReported(true)}
          className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-zinc-400 dark:text-[#7e908c] transition-colors hover:text-red-600 dark:hover:text-red-400"
        >
          <Flag className="size-3.5" />
          Report
        </button>
      )}
    </article>
  );
}
