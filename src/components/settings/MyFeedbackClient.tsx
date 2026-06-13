"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";

import { useAppState } from "@/hooks/useAppState";
import type {
  FeedbackIssueType,
  FeedbackResponse,
  FeedbackSourceType,
} from "@/types/feedback";

const sourceLabels: Record<FeedbackSourceType, string> = {
  general: "General",
  task: "Task",
  topic: "Topic",
  faq: "FAQ",
};

const issueLabels: Record<FeedbackIssueType, string> = {
  confusing: "Confusing",
  outdated: "Outdated",
  missing_information: "Missing information",
  broken_link: "Broken link",
  does_not_apply: "Does not apply",
  other: "Other",
};

function formatDate(iso: string) {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function FeedbackCard({ feedback }: Readonly<{ feedback: FeedbackResponse }>) {
  return (
    <article className="space-y-2 rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600">
          {sourceLabels[feedback.sourceType]}
          {feedback.sourceId ? `: ${feedback.sourceId}` : ""}
        </span>
        <span className="shrink-0 text-xs text-zinc-400">
          {formatDate(feedback.createdAt)}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
        {feedback.wasHelpful === true ? (
          <>
            <ThumbsUp className="size-4 text-teal-700" />
            Helpful
          </>
        ) : feedback.wasHelpful === false ? (
          <>
            <ThumbsDown className="size-4 text-red-600" />
            Not helpful
          </>
        ) : (
          <span className="text-zinc-400">No rating</span>
        )}
      </div>

      {feedback.issueType ? (
        <p className="text-sm text-zinc-600">
          <span className="font-semibold text-zinc-800">Issue: </span>
          {issueLabels[feedback.issueType]}
        </p>
      ) : null}

      {feedback.comment ? (
        <p className="text-sm leading-6 text-zinc-600">{feedback.comment}</p>
      ) : null}
    </article>
  );
}

export function MyFeedbackClient() {
  const { feedbackResponses, isHydrated } = useAppState();
  // Newest first.
  const items = [...feedbackResponses].reverse();

  return (
    <section className="space-y-6">
      <Link
        href="/settings"
        className="text-sm font-semibold text-teal-800 underline decoration-2 underline-offset-4"
      >
        Back to Settings
      </Link>

      <div>
        <h2 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950">
          My feedback
        </h2>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Feedback you have saved on this device.
        </p>
      </div>

      {!isHydrated ? (
        <div className="h-24 rounded-lg bg-zinc-100" />
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {items.map((feedback) => (
            <FeedbackCard key={feedback.id} feedback={feedback} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <p className="text-sm leading-6 text-zinc-600">
            You have not saved any feedback yet. Use the feedback controls
            around the app or the General feedback form in Settings.
          </p>
        </div>
      )}
    </section>
  );
}
