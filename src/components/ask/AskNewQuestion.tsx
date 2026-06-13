"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

import { useAppState } from "@/hooks/useAppState";

export function AskNewQuestion() {
  const router = useRouter();
  const { addAskQuestion } = useAppState();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const canPost = title.trim().length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canPost) {
      return;
    }

    const id = addAskQuestion({ title, body });
    router.push(`/ask/${id}`);
  }

  return (
    <section className="space-y-6">
      <Link
        href="/ask"
        className="text-sm font-semibold text-teal-800 underline decoration-2 underline-offset-4"
      >
        Back to Ask
      </Link>

      <div>
        <h2 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950">
          Ask a question
        </h2>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Other international students can browse and answer your question.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-zinc-800">Question</span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. How do I register with a GP near campus?"
            autoFocus
            className="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-teal-700"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-zinc-800">
            Details{" "}
            <span className="font-normal text-zinc-400">(optional)</span>
          </span>
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={5}
            placeholder="Add any context that helps others answer."
            className="w-full resize-y rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm leading-6 text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-teal-700"
          />
        </label>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!canPost}
            className="h-11 flex-1 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            Post question
          </button>
          <Link
            href="/ask"
            className="flex h-11 items-center justify-center rounded-md px-4 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </section>
  );
}
