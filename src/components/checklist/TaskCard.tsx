"use client";

import { Check } from "lucide-react";
import Link from "next/link";

import { TaskStatusControl } from "@/components/checklist/TaskStatusControl";
import { cn } from "@/lib/utils";
import type { PersonalisedTask } from "@/lib/personalisation";
import type { TaskId } from "@/types/content";
import type { TaskProgressStatus } from "@/types/progress";

type TaskCardProps = {
  task: PersonalisedTask;
  status?: TaskProgressStatus;
  onStatusChange: (taskId: TaskId, status: TaskProgressStatus) => void;
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

export function TaskCard({
  task,
  status,
  onStatusChange,
}: Readonly<TaskCardProps>) {
  const isCollapsed = status === "done" || status === "skipped";
  const collapsedLabel = status === "skipped" ? "Not applicable" : "Done";

  return (
    <article
      className={cn(
        "rounded-lg border p-4 transition-colors duration-300",
        isCollapsed ? "border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-white/5" : "border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f]",
      )}
    >
      {/* Header row — always visible */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2.5">
          {isCollapsed ? (
            <button
              type="button"
              aria-pressed="true"
              aria-label={`Reopen "${task.title}"`}
              onClick={() => onStatusChange(task.id, "not_started")}
              className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-teal-700 dark:bg-teal-400 dark:text-[#0f1a18] text-white transition-colors hover:bg-teal-800 dark:hover:bg-teal-300"
            >
              <Check className="size-3.5" strokeWidth={3} />
            </button>
          ) : null}
          <h3
            className={cn(
              "min-w-0 text-base font-semibold leading-6",
              isCollapsed
                ? "truncate text-zinc-500 dark:text-[#9fb0ad] line-through"
                : "text-zinc-950 dark:text-[#e7edeb]",
            )}
          >
            {task.title}
          </h3>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-md px-2 py-1 text-xs font-semibold",
            isCollapsed
              ? "text-zinc-400 dark:text-[#7e908c]"
              : priorityStyles[task.urgency],
          )}
        >
          {isCollapsed ? collapsedLabel : priorityLabels[task.urgency]}
        </span>
      </div>

      {/* Collapsible body */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isCollapsed
            ? "grid-rows-[0fr] opacity-0"
            : "grid-rows-[1fr] opacity-100",
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-4 pt-3">
            <p className="text-sm leading-6 text-zinc-600 dark:text-[#9fb0ad]">{task.summary}</p>
            {task.applicability === "maybe_applicable" ? (
              <p className="rounded-md bg-amber-50 dark:bg-amber-950/40 px-3 py-2 text-sm font-medium text-amber-900 dark:text-amber-300">
                Maybe applicable based on your answers
              </p>
            ) : null}
            <TaskStatusControl
              taskId={task.id}
              status={status}
              onStatusChange={onStatusChange}
            />
            <Link
              href={`/checklist/${task.id}`}
              className="flex h-11 w-full items-center justify-center rounded-md border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] px-3 text-sm font-semibold text-zinc-700 dark:text-[#9fb0ad] transition-colors hover:bg-zinc-100 dark:hover:bg-white/10"
            >
              View guide
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
