import Link from "next/link";

import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import {
  getOfficialSourcesByIds,
  getTaskById,
  getTopicById,
} from "@/lib/content";
import type { FaqSearchResult } from "@/lib/faq-search";
import type { FaqItem } from "@/types/content";

type FaqResultCardProps = {
  result: FaqSearchResult;
};

function getRelatedContent(faq: FaqItem) {
  const tasks = faq.relatedTaskIds.flatMap((taskId) => {
    const task = getTaskById(taskId);
    return task ? [task] : [];
  });
  const topics = faq.relatedTopicIds.flatMap((topicId) => {
    const topic = getTopicById(topicId);
    return topic ? [topic] : [];
  });
  const sourceIds = Array.from(
    new Set([
      ...tasks.flatMap((task) => task.officialSourceIds),
      ...topics.flatMap((topic) => topic.officialSourceIds),
    ]),
  );

  return {
    tasks,
    topics,
    sources: getOfficialSourcesByIds(sourceIds),
  };
}

export function FaqResultCard({ result }: Readonly<FaqResultCardProps>) {
  const { faq } = result;
  const { tasks, topics, sources } = getRelatedContent(faq);

  return (
    <article className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4">
      <div>
        <h3 className="text-base font-semibold leading-6 text-zinc-950">
          {faq.question}
        </h3>
        <p className="mt-2 text-sm leading-6 text-zinc-600">{faq.answer}</p>
      </div>

      {tasks.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Related tasks
          </p>
          <div className="flex flex-wrap gap-2">
            {tasks.map((task) => (
              <Link
                key={task.id}
                href={`/checklist/${task.id}`}
                className="rounded-md bg-zinc-100 px-2.5 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-200"
              >
                {task.title}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {topics.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Related topics
          </p>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/topics/${topic.id}`}
                className="rounded-md bg-teal-50 px-2.5 py-1.5 text-xs font-semibold text-teal-800 transition-colors hover:bg-teal-100"
              >
                {topic.title}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {sources.length > 0 ? (
        <div className="space-y-2 border-t border-zinc-100 pt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Official sources
          </p>
          <div className="grid gap-2">
            {sources.map((source) => (
              <a
                key={source.id}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold leading-5 text-teal-800 underline decoration-2 underline-offset-4"
              >
                {source.title}
              </a>
            ))}
          </div>
        </div>
      ) : null}

      <FeedbackForm
        sourceType="faq"
        sourceId={faq.id}
        title="Feedback on this FAQ"
        compact
        embedded
      />
    </article>
  );
}
