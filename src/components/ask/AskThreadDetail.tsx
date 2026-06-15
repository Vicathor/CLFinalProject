"use client";

import { Flag, MessageSquarePlus, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { AnswerCard } from "@/components/ask/AnswerCard";
import { LoginSheet } from "@/components/ask/LoginSheet";
import { useAuth } from "@/hooks/useAuth";
import { fetchThreadById, postAnswer, reportContent } from "@/lib/ask-db";
import { formatAskDate } from "@/lib/ask";
import { getTopicById } from "@/lib/content";
import type { AskThread } from "@/types/ask";

function bannerKey(userId: string) {
  return `ask_banner_seen_${userId}`;
}

function reportedKey(userId: string) {
  return `ask_reported_${userId}`;
}

function getReportedSet(userId: string): Set<string> {
  try {
    const raw = localStorage.getItem(reportedKey(userId));
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function persistReported(userId: string, set: Set<string>) {
  localStorage.setItem(reportedKey(userId), JSON.stringify([...set]));
}

type AskThreadDetailProps = {
  questionId: string;
  // Provided for official FAQ threads (from JSON); null for community threads.
  seedThread: AskThread | null;
};

export function AskThreadDetail({
  questionId,
  seedThread,
}: Readonly<AskThreadDetailProps>) {
  const { user, profile } = useAuth();
  const [thread, setThread] = useState<AskThread | null>(seedThread);
  const [isLoadingThread, setIsLoadingThread] = useState(!seedThread);
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [answerError, setAnswerError] = useState<string | null>(null);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [hasSeenBanner, setHasSeenBanner] = useState(true);
  const [reportedIds, setReportedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      setHasSeenBanner(!!localStorage.getItem(bannerKey(user.id)));
      setReportedIds(getReportedSet(user.id));
    } else {
      setReportedIds(new Set());
    }
  }, [user?.id]);

  // Community threads are fetched from DB; official FAQ threads come from props.
  useEffect(() => {
    if (seedThread) return;
    setIsLoadingThread(true);
    fetchThreadById(questionId).then((fetched) => {
      setThread(fetched);
      setIsLoadingThread(false);
    });
  }, [questionId, seedThread]);

  if (isLoadingThread) {
    return (
      <div className="space-y-4">
        <Link
          href="/ask"
          className="text-sm font-semibold text-teal-800 dark:text-teal-400 underline decoration-2 underline-offset-4"
        >
          Back to Ask
        </Link>
        <p className="text-sm leading-6 text-zinc-600 dark:text-[#9fb0ad]">
          Loading question…
        </p>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="space-y-4">
        <Link
          href="/ask"
          className="text-sm font-semibold text-teal-800 dark:text-teal-400 underline decoration-2 underline-offset-4"
        >
          Back to Ask
        </Link>
        <p className="text-sm leading-6 text-zinc-600 dark:text-[#9fb0ad]">
          This question could not be found. It may have been removed.
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

  function handleAnswerButtonClick() {
    if (!user) {
      setShowLogin(true);
      return;
    }
    setComposerOpen(true);
  }

  async function handleAnswerSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.trim() || !user || !profile) return;

    setIsSubmittingAnswer(true);
    setAnswerError(null);

    const { error } = await postAnswer({
      questionId,
      body: draft,
      authorId: user.id,
      authorName: profile.display_name,
    });

    setIsSubmittingAnswer(false);

    if (error) {
      setAnswerError(error);
      return;
    }

    // Refresh thread to show the new answer
    const updated = await fetchThreadById(questionId);
    if (updated) setThread(updated);
    if (!hasSeenBanner) {
      localStorage.setItem(bannerKey(user.id), "1");
      setHasSeenBanner(true);
    }

    setDraft("");
    setComposerOpen(false);
  }

  async function handleReport() {
    if (!user) {
      setShowLogin(true);
      return;
    }
    const key = `question:${questionId}`;
    if (reportedIds.has(key)) return;
    const { error } = await reportContent({
      targetType: "question",
      targetId: questionId,
      reporterId: user.id,
    });
    if (!error) {
      const next = new Set(reportedIds).add(key);
      persistReported(user.id, next);
      setReportedIds(next);
    }
  }

  function makeAnswerReporter(answerId: string) {
    return async (): Promise<boolean> => {
      if (!user) {
        setShowLogin(true);
        return false;
      }
      const key = `answer:${answerId}`;
      if (reportedIds.has(key)) return true;
      const { error } = await reportContent({
        targetType: "answer",
        targetId: answerId,
        reporterId: user.id,
      });
      if (!error) {
        const next = new Set(reportedIds).add(key);
        persistReported(user.id, next);
        setReportedIds(next);
        return true;
      }
      return false;
    };
  }

  return (
    <>
      <LoginSheet
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSuccess={() => setComposerOpen(true)}
      />

      <article className="space-y-6">
        <Link
          href="/ask"
          className="text-sm font-semibold text-teal-800 dark:text-teal-400 underline decoration-2 underline-offset-4"
        >
          Back to Ask
        </Link>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {isOfficial ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 dark:bg-teal-950 px-2 py-0.5 text-xs font-semibold text-teal-700 dark:text-teal-400">
                <ShieldCheck className="size-3.5" />
                Official
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-white/5 px-2 py-0.5 text-xs font-semibold text-zinc-600 dark:text-[#9fb0ad]">
                Community
              </span>
            )}
          </div>

          <h2 className="text-2xl font-semibold leading-tight text-zinc-950 dark:text-[#e7edeb]">
            {thread.title}
          </h2>

          {thread.body ? (
            <p className="text-base leading-7 text-zinc-600 dark:text-[#9fb0ad]">
              {thread.body}
            </p>
          ) : null}

          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-[#9fb0ad]">
            <span>{thread.authorName}</span>
            <span aria-hidden="true">·</span>
            <span>{formatAskDate(thread.createdAt)}</span>
          </div>

          {!isOfficial ? (
            reportedIds.has(`question:${questionId}`) ? (
              <p className="text-xs font-medium text-zinc-400 dark:text-[#7e908c]">
                Reported — a moderator will review this.
              </p>
            ) : (
              <button
                type="button"
                onClick={handleReport}
                className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 dark:text-[#7e908c] transition-colors hover:text-red-600 dark:hover:text-red-400"
              >
                <Flag className="size-3.5" />
                Report question
              </button>
            )
          ) : null}
        </div>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-zinc-950 dark:text-[#e7edeb]">
            {answerCount} {answerCount === 1 ? "answer" : "answers"}
          </h3>

          {answerCount > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {thread.answers.map((answer) => (
                <AnswerCard
                  key={answer.id}
                  answer={answer}
                  initialReported={reportedIds.has(`answer:${answer.id}`)}
                  onReport={makeAnswerReporter(answer.id)}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-zinc-300 dark:border-white/10 bg-white dark:bg-[#18221f] p-4 text-sm leading-6 text-zinc-500 dark:text-[#9fb0ad]">
              No answers yet. Be the first to help.
            </p>
          )}

          {composerOpen ? (
            <form
              onSubmit={handleAnswerSubmit}
              className="space-y-3 rounded-lg border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] p-4"
            >
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-zinc-800 dark:text-[#e7edeb]">
                  Your answer
                </span>
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={4}
                  autoFocus
                  placeholder="Share what worked for you."
                  className="w-full resize-y rounded-md border border-zinc-300 dark:border-white/10 bg-white dark:bg-[#18221f] px-3 py-2 text-sm leading-6 text-zinc-950 dark:text-[#e7edeb] outline-none placeholder:text-zinc-400 dark:placeholder:text-[#7e908c] focus:border-teal-700 dark:focus:border-teal-400"
                />
              </label>
              {answerError ? (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {answerError}
                </p>
              ) : null}

              {!hasSeenBanner ? (
                <p className="rounded-md bg-teal-50 dark:bg-teal-950 px-3 py-2.5 text-sm leading-5 text-teal-800 dark:text-teal-300">
                  You are posting as{" "}
                  <span className="font-semibold">{profile?.display_name}</span>.{" "}
                  <Link href="/settings" className="underline underline-offset-2">
                    You can change this in settings.
                  </Link>
                </p>
              ) : null}

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!draft.trim() || isSubmittingAnswer}
                  className="h-11 flex-1 rounded-md bg-teal-700 dark:bg-teal-400 dark:text-[#0f1a18] px-4 text-sm font-semibold text-white transition-colors hover:bg-teal-800 dark:hover:bg-teal-300 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:disabled:bg-white/10"
                >
                  {isSubmittingAnswer ? "Posting…" : "Post answer"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraft("");
                    setComposerOpen(false);
                    setAnswerError(null);
                  }}
                  className="h-11 rounded-md px-4 text-sm font-semibold text-zinc-600 dark:text-[#9fb0ad] transition-colors hover:bg-zinc-50 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={handleAnswerButtonClick}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-teal-700 dark:border-teal-400/40 bg-white dark:bg-[#18221f] px-4 text-sm font-semibold text-teal-800 dark:text-teal-400 transition-colors hover:bg-teal-50 dark:hover:bg-teal-400/10"
            >
              <MessageSquarePlus className="size-4" />
              Answer this question
            </button>
          )}
        </section>

        {relatedTopics.length > 0 ? (
          <section className="space-y-2 border-t border-zinc-100 dark:border-white/5 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-[#9fb0ad]">
              Related topics
            </p>
            <div className="flex flex-wrap gap-2">
              {relatedTopics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/topics/${topic.id}`}
                  className="rounded-md bg-teal-50 dark:bg-teal-950 px-2.5 py-1.5 text-xs font-semibold text-teal-800 dark:text-teal-400 transition-colors hover:bg-teal-100 dark:hover:bg-teal-400/15"
                >
                  {topic.title}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </>
  );
}
