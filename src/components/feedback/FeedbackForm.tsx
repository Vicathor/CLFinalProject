"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";

import { useAppState } from "@/hooks/useAppState";
import type {
  FeedbackIssueType,
  FeedbackSourceType,
} from "@/types/feedback";

type FeedbackFormProps = {
  sourceType?: FeedbackSourceType;
  sourceId?: string;
  title?: string;
  helpfulnessPrompt?: string;
  compact?: boolean;
  hideTitle?: boolean;
  embedded?: boolean;
};

const issueOptions: Array<{ value: FeedbackIssueType; label: string }> = [
  { value: "confusing", label: "Confusing" },
  { value: "outdated", label: "Outdated" },
  { value: "missing_information", label: "Missing information" },
  { value: "broken_link", label: "Broken link" },
  { value: "does_not_apply", label: "Does not apply" },
  { value: "other", label: "Other" },
];

export function FeedbackForm({
  sourceType = "general",
  sourceId,
  title = "Share feedback",
  helpfulnessPrompt = "Was this helpful?",
  compact = false,
  hideTitle = false,
  embedded = false,
}: Readonly<FeedbackFormProps>) {
  const { saveFeedback, isHydrated } = useAppState();
  const [wasHelpful, setWasHelpful] = useState<boolean | null>(null);
  const [hasHelpfulnessAnswer, setHasHelpfulnessAnswer] = useState(false);
  const [issueType, setIssueType] = useState<FeedbackIssueType | "">("");
  const [comment, setComment] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasHelpfulnessAnswer) {
      setError("Select whether this was helpful before saving feedback.");
      return;
    }

    saveFeedback({
      sourceType,
      sourceId,
      wasHelpful,
      issueType: issueType || undefined,
      comment: comment.trim() || undefined,
    });

    setIssueType("");
    setComment("");
    setSaved(true);
    setError("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        embedded
          ? "space-y-4 border-t border-zinc-100 dark:border-white/5 pt-4"
          : "space-y-4 rounded-lg border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] p-4"
      }
    >
      {hideTitle || embedded ? null : (
        <h3 className="text-base font-semibold text-zinc-950 dark:text-[#e7edeb]">{title}</h3>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-zinc-800 dark:text-[#e7edeb]">
            {helpfulnessPrompt}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Yes, helpful"
              aria-pressed={hasHelpfulnessAnswer && wasHelpful === true}
              onClick={() => {
                setWasHelpful(true);
                setHasHelpfulnessAnswer(true);
                setError("");
                setSaved(false);
              }}
              className={`flex size-10 items-center justify-center rounded-md border transition-colors ${
                hasHelpfulnessAnswer && wasHelpful === true
                  ? "border-teal-700 dark:border-teal-400/40 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400"
                  : "border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] text-zinc-500 dark:text-[#9fb0ad] hover:bg-zinc-50 dark:hover:bg-white/5"
              }`}
            >
              <ThumbsUp className="size-5" />
            </button>
            <button
              type="button"
              aria-label="No, not helpful"
              aria-pressed={hasHelpfulnessAnswer && wasHelpful === false}
              onClick={() => {
                setWasHelpful(false);
                setHasHelpfulnessAnswer(true);
                setError("");
                setSaved(false);
              }}
              className={`flex size-10 items-center justify-center rounded-md border transition-colors ${
                hasHelpfulnessAnswer && wasHelpful === false
                  ? "border-red-300 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400"
                  : "border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] text-zinc-500 dark:text-[#9fb0ad] hover:bg-zinc-50 dark:hover:bg-white/5"
              }`}
            >
              <ThumbsDown className="size-5" />
            </button>
          </div>
        </div>
        {error ? (
          <p id="feedback-helpfulness-error" className="text-sm text-red-700 dark:text-red-400">
            {error}
          </p>
        ) : null}
      </div>

      {hasHelpfulnessAnswer ? (
        <>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-zinc-800 dark:text-[#e7edeb]">
              Issue, if any
            </span>
            <select
              value={issueType}
              onChange={(event) =>
                setIssueType(event.target.value as FeedbackIssueType | "")
              }
              className="h-11 w-full rounded-md border border-zinc-300 dark:border-white/10 bg-white dark:bg-[#18221f] px-3 text-sm text-zinc-950 dark:text-[#e7edeb] outline-none focus:border-teal-700 dark:focus:border-teal-400"
            >
              <option value=""></option>
              {issueOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-zinc-800 dark:text-[#e7edeb]">Comment</span>
            <textarea
              value={comment}
              onChange={(event) => {
                setComment(event.target.value);
                setSaved(false);
              }}
              rows={compact ? 3 : 4}
              placeholder="What should be improved?"
              className="w-full resize-y rounded-md border border-zinc-300 dark:border-white/10 bg-white dark:bg-[#18221f] px-3 py-2 text-sm leading-6 text-zinc-950 dark:text-[#e7edeb] outline-none placeholder:text-zinc-400 dark:placeholder:text-[#7e908c] focus:border-teal-700 dark:focus:border-teal-400"
            />
          </label>
        </>
      ) : null}

      {hasHelpfulnessAnswer ? (
        <button
          type="submit"
          disabled={!isHydrated}
          className="h-11 w-full rounded-md bg-teal-700 dark:bg-teal-400 dark:text-[#0f1a18] px-4 text-sm font-semibold text-white transition-colors hover:bg-teal-800 dark:hover:bg-teal-300 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:disabled:bg-white/10"
        >
          Save feedback
        </button>
      ) : null}

      {saved ? (
        <p className="text-sm font-medium text-teal-800 dark:text-teal-400">Feedback saved.</p>
      ) : null}
    </form>
  );
}
