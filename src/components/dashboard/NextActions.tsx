import { ChevronRight } from "lucide-react";
import Link from "next/link";

import type { PersonalisedTask } from "@/lib/personalisation";
import type { TaskId } from "@/types/content";

type NextActionsProps = {
  tasks: readonly PersonalisedTask[];
  onMarkDone: (taskId: TaskId) => void;
};

const urgencyLabels: Record<PersonalisedTask["urgency"], string> = {
  urgent: "Urgent",
  important: "Important",
  normal: "Next",
  later: "Later",
};

const urgencyStyles: Record<PersonalisedTask["urgency"], string> = {
  urgent: "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300",
  important: "bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300",
  normal: "bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-[#9fb0ad]",
  later: "bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-[#9fb0ad]",
};

export function NextActions({ tasks, onMarkDone }: Readonly<NextActionsProps>) {
  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-zinc-950 dark:text-[#e7edeb]">
          Top next actions
        </h3>
        <Link
          href="/checklist"
          className="flex shrink-0 items-center gap-0.5 text-sm font-semibold text-teal-700 dark:text-teal-400 transition-colors hover:text-teal-800"
        >
          View full checklist
          <ChevronRight className="size-4" />
        </Link>
      </div>
      {tasks.length === 0 ? (
        <p className="text-sm leading-6 text-zinc-600 dark:text-[#9fb0ad]">
          No next actions left in the current task set.
        </p>
      ) : (
        <ol className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="space-y-3 rounded-md border border-zinc-200 dark:border-white/5 p-3"
            >
              <div className="space-y-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 font-semibold leading-6 text-zinc-950 dark:text-[#e7edeb]">
                    {task.title}
                  </p>
                  <span
                    className={`shrink-0 rounded-md px-2 py-1 text-xs font-semibold ${urgencyStyles[task.urgency]}`}
                  >
                    {urgencyLabels[task.urgency]}
                  </span>
                </div>
                <p className="text-sm leading-6 text-zinc-600 dark:text-[#9fb0ad]">
                  {task.summary}
                </p>
              </div>
              {task.applicability === "maybe_applicable" ? (
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                  Maybe applicable
                </p>
              ) : null}
              <button
                type="button"
                onClick={() => onMarkDone(task.id)}
                className="h-11 w-full rounded-md border border-teal-700 dark:border-teal-400/40 bg-white dark:bg-[#18221f] px-3 text-sm font-semibold text-teal-800 dark:text-teal-400 transition-colors hover:bg-teal-50 dark:hover:bg-teal-400/10"
              >
                Mark done
              </button>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
