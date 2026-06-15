"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { LoginSheet } from "@/components/ask/LoginSheet";
import { useAuth } from "@/hooks/useAuth";
import { postQuestion } from "@/lib/ask-db";

function bannerKey(userId: string) {
  return `ask_banner_seen_${userId}`;
}

export function AskNewQuestion() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasSeenBanner, setHasSeenBanner] = useState(true);

  useEffect(() => {
    if (user) {
      setHasSeenBanner(!!localStorage.getItem(bannerKey(user.id)));
    }
  }, [user?.id]);

  const canPost = title.trim().length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canPost) return;

    if (!user || !profile) {
      setShowLogin(true);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const { id, error } = await postQuestion({
      title,
      body: body || undefined,
      authorId: user.id,
      authorName: profile.display_name,
    });

    setIsSubmitting(false);

    if (error || !id) {
      setSubmitError(error ?? "Failed to post. Please try again.");
      return;
    }

    if (!hasSeenBanner) {
      localStorage.setItem(bannerKey(user.id), "1");
    }

    router.push(`/ask/${id}`);
  }

  return (
    <>
      <LoginSheet
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
      />

      <section className="space-y-6">
        <Link
          href="/ask"
          className="text-sm font-semibold text-teal-800 dark:text-teal-400 underline decoration-2 underline-offset-4"
        >
          Back to Ask
        </Link>

        <div>
          <h2 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950 dark:text-[#e7edeb]">
            Ask a question
          </h2>
          <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-[#9fb0ad]">
            Other international students can browse and answer your question.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-zinc-800 dark:text-[#e7edeb]">
              Question
            </span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. How do I register with a GP near campus?"
              autoFocus
              className="h-11 w-full rounded-md border border-zinc-300 dark:border-white/10 bg-white dark:bg-[#18221f] px-3 text-sm text-zinc-950 dark:text-[#e7edeb] outline-none transition-colors placeholder:text-zinc-400 dark:placeholder:text-[#7e908c] focus:border-teal-700 dark:focus:border-teal-400"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-zinc-800 dark:text-[#e7edeb]">
              Details{" "}
              <span className="font-normal text-zinc-400 dark:text-[#7e908c]">
                (optional)
              </span>
            </span>
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={5}
              placeholder="Add any context that helps others answer."
              className="w-full resize-y rounded-md border border-zinc-300 dark:border-white/10 bg-white dark:bg-[#18221f] px-3 py-2 text-sm leading-6 text-zinc-950 dark:text-[#e7edeb] outline-none placeholder:text-zinc-400 dark:placeholder:text-[#7e908c] focus:border-teal-700 dark:focus:border-teal-400"
            />
          </label>

          {submitError ? (
            <p className="text-sm text-red-600 dark:text-red-400">
              {submitError}
            </p>
          ) : null}

          {!user ? (
            <p className="text-xs text-zinc-500 dark:text-[#9fb0ad]">
              You&apos;ll be asked to sign in with your UT email when you post.
            </p>
          ) : null}

          {user && !hasSeenBanner ? (
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
              disabled={!canPost || isSubmitting}
              className="h-11 flex-1 rounded-md bg-teal-700 dark:bg-teal-400 dark:text-[#0f1a18] px-4 text-sm font-semibold text-white transition-colors hover:bg-teal-800 dark:hover:bg-teal-300 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:disabled:bg-white/10"
            >
              {isSubmitting ? "Posting…" : "Post question"}
            </button>
            <Link
              href="/ask"
              className="flex h-11 items-center justify-center rounded-md px-4 text-sm font-semibold text-zinc-600 dark:text-[#9fb0ad] transition-colors hover:bg-zinc-50 dark:hover:bg-white/5"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </>
  );
}
