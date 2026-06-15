import Link from "next/link";

import { AskGuidanceBlock } from "@/components/content/AskGuidanceBlock";
import { OfficialSourceCard } from "@/components/content/OfficialSourceCard";
import { StudentTipCard } from "@/components/content/StudentTipCard";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { RelatedTasks } from "@/components/topics/RelatedTasks";
import {
  getAskContactsByIds,
  getFaqsByIds,
  getOfficialSourcesByIds,
  getStudentTipsByIds,
  getTaskById,
} from "@/lib/content";
import type { Topic } from "@/types/content";

type TopicDetailProps = {
  topic: Topic;
};

function getBodySections(body: string) {
  return body
    .split(/\n+/)
    .map((section) => section.trim())
    .filter(Boolean);
}

export function TopicDetail({ topic }: Readonly<TopicDetailProps>) {
  const relatedTasks = topic.relatedTaskIds.flatMap((taskId) => {
    const task = getTaskById(taskId);
    return task ? [task] : [];
  });
  const officialSources = getOfficialSourcesByIds(topic.officialSourceIds);
  const studentTips = getStudentTipsByIds(topic.studentTipIds);
  const askContacts = getAskContactsByIds(topic.askContactIds);
  const faqs = getFaqsByIds(topic.faqIds);

  return (
    <article className="space-y-6">
      <div className="space-y-3">
        <Link
          href="/topics"
          className="text-sm font-semibold text-teal-800 dark:text-teal-400 underline decoration-2 underline-offset-4"
        >
          Back to topics
        </Link>
        <div>
          <h2 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950 dark:text-[#e7edeb]">
            {topic.title}
          </h2>
          <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-[#9fb0ad]">
            {topic.summary}
          </p>
        </div>
      </div>

      <section className="space-y-3 rounded-lg border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] p-4">
        <h3 className="text-base font-semibold text-zinc-950 dark:text-[#e7edeb]">Overview</h3>
        {getBodySections(topic.body).map((section) => (
          <p key={section} className="text-sm leading-6 text-zinc-600 dark:text-[#9fb0ad]">
            {section}
          </p>
        ))}
      </section>

      <RelatedTasks tasks={relatedTasks} />

      <section className="space-y-3">
        <h3 className="text-base font-semibold text-zinc-950 dark:text-[#e7edeb]">
          Official sources
        </h3>
        <div className="grid gap-3">
          {officialSources.map((source) => (
            <OfficialSourceCard key={source.id} source={source} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold text-zinc-950 dark:text-[#e7edeb]">Student tips</h3>
        <div className="grid gap-3">
          {studentTips.map((tip) => (
            <StudentTipCard key={tip.id} tip={tip} />
          ))}
        </div>
      </section>

      <AskGuidanceBlock contacts={askContacts} />

      {faqs.length > 0 ? (
        <section className="space-y-3 rounded-lg border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] p-4">
          <h3 className="text-base font-semibold text-zinc-950 dark:text-[#e7edeb]">FAQs</h3>
          <div className="grid gap-3">
            {faqs.map((faq) => (
              <article key={faq.id} className="rounded-md bg-zinc-50 dark:bg-white/5 p-3">
                <p className="text-sm font-semibold text-zinc-950 dark:text-[#e7edeb]">
                  {faq.question}
                </p>
                <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-[#9fb0ad]">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <FeedbackForm
        sourceType="topic"
        sourceId={topic.id}
        title="Feedback on this topic"
        compact
        hideTitle
      />
    </article>
  );
}
