"use client";

import { Flag, MessageSquarePlus, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";

import { AnswerCard } from "@/components/ask/AnswerCard";
import { useAppState } from "@/hooks/useAppState";
import { formatAskDate } from "@/lib/ask";
import { getTopicById } from "@/lib/content";
import type { AskThread } from "@/types/ask";

type AskThreadDetailProps = {
  questionId: string;
  // Seed thread when the id belongs to bundled content; null for user posts.
  seedThread: AskThread | null;
};

export function AskThreadDetail({
  questionId,
  seedThread,
}: Readonly<AskThreadDetailProps>) {
  const { askQuestions, askAnswers, isHydrated, addAskAnswer } = useAppState();
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [questionReported, setQuestionReported] = useState(false);

  // Resolve the thread from seed first (so SSR and the first client render
  // match), then layer in locally stored user content once hydrated.
  const thread = useMemo<AskThread | null>(() => {
    const base = isHydrated
      ? (askQuestions.find((question) => question.id === questionId) ??
        seedThread)
      : seedThread;

    if (!base) {
      return null;
    }

    const extraAnswers = isHydrated ? (askAnswers[questionId] ?? []) : [];

    if (extraAnswers.length === 0) {
      return base;
    }

    return { ...base, answers: [...base.answers, ...extraAnswers] };
  }, [askAnswers, askQuestions, isHydrated, questionId, seedThread]);

  if (!thread) {
    return (
      <div className="space-y-4">
        <Link
          href="/ask"
          className="text-sm font-semibold text-teal-800 underline decoration-2 underline-offset-4"
        >
          Back to Ask
        </Link>
        <p className="text-sm leading-6 text-zinc-600">
          {isHydrated
            ? "This question could not be found. It may have been removed."
            : "Loading question…"}
        </p>
      </div>
    );
  }

  const isOfficial = thread.category === "official";
  const answerCount = thread.answers.length;

  const relatedTopics = thread.relatedTopicIds.flatMap((topicId) => {
    const topic = getTopicById(topicId);
    return topic ? [topic] : [];
  });

  function handleAnswerSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.trim()) {
      return;
    }

    addAskAnswer(questionId, draft);
    setDraft("");
    setComposerOpen(false);
  }

  return (
    <article className="space-y-6">
      <Link
        href="/ask"
        className="text-sm font-semibold text-teal-800 underline decoration-2 underline-offset-4"
      >
        Back to Ask
      </Link>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {isOfficial ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700">
              <ShieldCheck className="size-3.5" />
              Official
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600">
              Community
            </span>
          )}
        </div>

        <h2 className="text-2xl font-semibold leading-tight text-zinc-950">
          {thread.title}
        </h2>

        {thread.body ? (
          <p className="text-base leading-7 text-zinc-600">{thread.body}</p>
        ) : null}

        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <span>{thread.authorName}</span>
          <span aria-hidden="true">·</span>
          <span>{formatAskDate(thread.createdAt)}</span>
        </div>

        {!isOfficial ? (
          questionReported ? (
            <p className="text-xs font-medium text-zinc-400">
              Reported — a moderator will review this.
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setQuestionReported(true)}
              className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 transition-colors hover:text-red-600"
            >
              <Flag className="size-3.5" />
              Report question
            </button>
          )
        ) : null}
      </div>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-zinc-950">
          {answerCount} {answerCount === 1 ? "answer" : "answers"}
        </h3>

        {answerCount > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {thread.answers.map((answer) => (
              <AnswerCard key={answer.id} answer={answer} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-zinc-300 bg-white p-4 text-sm leading-6 text-zinc-500">
            No answers yet. Be the first to help.
          </p>
        )}

        {composerOpen ? (
          <form
            onSubmit={handleAnswerSubmit}
            className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4"
          >
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-zinc-800">
                Your answer
              </span>
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                rows={4}
                autoFocus
                placeholder="Share what worked for you."
                className="w-full resize-y rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm leading-6 text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-teal-700"
              />
            </label>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!draft.trim()}
                className="h-11 flex-1 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
              >
                Post answer
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraft("");
                  setComposerOpen(false);
                }}
                className="h-11 rounded-md px-4 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-50"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setComposerOpen(true)}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-teal-700 bg-white px-4 text-sm font-semibold text-teal-800 transition-colors hover:bg-teal-50"
          >
            <MessageSquarePlus className="size-4" />
            Answer this question
          </button>
        )}
      </section>

      {relatedTopics.length > 0 ? (
        <section className="space-y-2 border-t border-zinc-100 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Related topics
          </p>
          <div className="flex flex-wrap gap-2">
            {relatedTopics.map((topic) => (
              <Link
                key={topic.id}
                href={`/topics/${topic.id}`}
                className="rounded-md bg-teal-50 px-2.5 py-1.5 text-xs font-semibold text-teal-800 transition-colors hover:bg-teal-100"
              >
                {topic.title}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
