import { ChevronRight, MessageCircle, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { formatAskDate } from "@/lib/ask";
import type { AskThread } from "@/types/ask";

type QuestionCardProps = {
  thread: AskThread;
};

export function QuestionCard({ thread }: Readonly<QuestionCardProps>) {
  const isOfficial = thread.category === "official";
  const answerCount = thread.answers.length;
  const preview = thread.body ?? thread.answers[0]?.body ?? "";

  return (
    <Link
      href={`/ask/${thread.id}`}
      className="group block rounded-lg border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] p-4 transition-colors hover:border-teal-700 dark:hover:border-teal-400/50 hover:bg-teal-50/40 dark:hover:bg-teal-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 active:bg-teal-50 dark:active:bg-teal-400/10"
    >
      <div className="flex items-center gap-2">
        {isOfficial ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 dark:bg-teal-950 px-2 py-0.5 text-xs font-semibold text-teal-700 dark:text-teal-400">
            <ShieldCheck className="size-3.5" />
            Official
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-white/5 px-2 py-0.5 text-xs font-semibold text-zinc-600 dark:text-[#9fb0ad]">
            {thread.authorName}
          </span>
        )}
      </div>

      <h3 className="mt-2 font-semibold leading-6 text-zinc-950 dark:text-[#e7edeb]">
        {thread.title}
      </h3>

      {preview ? (
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-600 dark:text-[#9fb0ad]">
          {preview}
        </p>
      ) : null}

      <div className="mt-3 flex items-center justify-between text-sm text-zinc-500 dark:text-[#9fb0ad]">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <MessageCircle className="size-4" />
          {answerCount} {answerCount === 1 ? "answer" : "answers"}
        </span>
        <span className="inline-flex items-center gap-1">
          {formatAskDate(thread.createdAt)}
          <ChevronRight className="size-4 text-zinc-300 transition-colors group-hover:text-teal-700" />
        </span>
      </div>
    </Link>
  );
}
