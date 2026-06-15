"use client";

import Link from "next/link";

import { TaskStatusControl } from "@/components/checklist/TaskStatusControl";
import { AskGuidanceBlock } from "@/components/content/AskGuidanceBlock";
import { Disclaimer } from "@/components/content/Disclaimer";
import { OfficialSourceCard } from "@/components/content/OfficialSourceCard";
import { StudentTipCard } from "@/components/content/StudentTipCard";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { useAppState } from "@/hooks/useAppState";
import {
  getAllTasks,
  getAskContactsByIds,
  getOfficialSourcesByIds,
  getStudentTipsByIds,
  getTaskById,
} from "@/lib/content";
import {
  getPersonalisedTasks,
  type PersonalisedTask,
} from "@/lib/personalisation";
import type { Task, TaskId } from "@/types/content";
import type { TaskProgressStatus } from "@/types/progress";

type TaskGuideProps = {
  task: Task;
};

const priorityLabels: Record<PersonalisedTask["urgency"], string> = {
  urgent: "Urgent",
  important: "Important",
  normal: "Normal",
  later: "Later",
};

const priorityStyles: Record<PersonalisedTask["urgency"], string> = {
  urgent: "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300",
  important: "bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300",
  normal: "bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-[#9fb0ad]",
  later: "bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-[#9fb0ad]",
};

function getPersonalisedTask(
  task: Task,
  profile: ReturnType<typeof useAppState>["profile"],
) {
  return (
    getPersonalisedTasks(getAllTasks(), profile).find(
      (personalisedTask) => personalisedTask.id === task.id,
    ) ?? {
      ...task,
      urgency: "normal",
      applicability: "applicable",
      priorityScore: task.basePriority,
      personalisationReasons: [],
    }
  );
}

export function TaskGuide({ task }: Readonly<TaskGuideProps>) {
  const { profile, taskProgress, setTaskStatus } = useAppState();
  const personalisedTask = getPersonalisedTask(task, profile);
  const officialSources = getOfficialSourcesByIds(task.officialSourceIds);
  const studentTips = getStudentTipsByIds(task.studentTipIds);
  const askContacts = getAskContactsByIds(task.askContactIds);
  const relatedTasks = task.relatedTaskIds.flatMap((taskId) => {
    const relatedTask = getTaskById(taskId);
    return relatedTask ? [relatedTask] : [];
  });

  function handleStatusChange(taskId: TaskId, status: TaskProgressStatus) {
    setTaskStatus(taskId, status);
  }

  return (
    <article className="space-y-6">
      <div className="space-y-3">
        <Link
          href="/checklist"
          className="text-sm font-semibold text-teal-800 dark:text-teal-400 underline decoration-2 underline-offset-4"
        >
          Back to checklist
        </Link>
        <div>
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-3xl font-semibold leading-tight text-zinc-950 dark:text-[#e7edeb]">
              {task.title}
            </h2>
            <span
              className={`shrink-0 rounded-md px-2 py-1 text-xs font-semibold ${priorityStyles[personalisedTask.urgency]}`}
            >
              {priorityLabels[personalisedTask.urgency]}
            </span>
          </div>
          <p className="mt-3 text-sm font-medium text-zinc-500 dark:text-[#9fb0ad]">
            {task.appliesToLabel}
          </p>
          {personalisedTask.applicability === "maybe_applicable" ? (
            <p className="mt-3 rounded-md bg-amber-50 dark:bg-amber-950/40 px-3 py-2 text-sm font-medium text-amber-900 dark:text-amber-300">
              Maybe applicable based on your answers
            </p>
          ) : null}
        </div>
      </div>

      <section className="space-y-3 rounded-lg border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] p-4">
        <h3 className="text-base font-semibold text-zinc-950 dark:text-[#e7edeb]">Status</h3>
        <TaskStatusControl
          taskId={task.id}
          status={taskProgress[task.id]?.status}
          onStatusChange={handleStatusChange}
        />
      </section>

      <section className="space-y-3 rounded-lg border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] p-4">
        <h3 className="text-base font-semibold text-zinc-950 dark:text-[#e7edeb]">What this is</h3>
        <p className="text-sm leading-6 text-zinc-600 dark:text-[#9fb0ad]">{task.whatThisIs}</p>
      </section>

      <section className="space-y-3 rounded-lg border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] p-4">
        <h3 className="text-base font-semibold text-zinc-950 dark:text-[#e7edeb]">
          Why it matters
        </h3>
        <p className="text-sm leading-6 text-zinc-600 dark:text-[#9fb0ad]">{task.whyItMatters}</p>
      </section>

      <section className="space-y-3 rounded-lg border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] p-4">
        <h3 className="text-base font-semibold text-zinc-950 dark:text-[#e7edeb]">
          What to do next
        </h3>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-zinc-600 dark:text-[#9fb0ad]">
          {task.nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

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

      <section className="space-y-3 rounded-lg border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] p-4">
        <h3 className="text-base font-semibold text-zinc-950 dark:text-[#e7edeb]">
          Related tasks
        </h3>
        <div className="grid gap-2">
          {relatedTasks.map((relatedTask) => (
            <Link
              key={relatedTask.id}
              href={`/checklist/${relatedTask.id}`}
              className="rounded-md bg-zinc-50 dark:bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-800 dark:text-[#e7edeb] transition-colors hover:bg-zinc-100 dark:hover:bg-white/10"
            >
              {relatedTask.title}
            </Link>
          ))}
        </div>
      </section>

      <Disclaimer>
        This guide depends on official-source pages staying current. Always open
        the linked official source before making a decision or submitting
        documents.
      </Disclaimer>

      <FeedbackForm
        sourceType="task"
        sourceId={task.id}
        title="Feedback on this task"
        compact
      />
    </article>
  );
}
