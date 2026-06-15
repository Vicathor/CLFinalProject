"use client";

import { cn } from "@/lib/utils";
import type { TaskId } from "@/types/content";
import type { TaskProgressStatus } from "@/types/progress";

type TaskStatusControlProps = {
  taskId: TaskId;
  status?: TaskProgressStatus;
  onStatusChange: (taskId: TaskId, status: TaskProgressStatus) => void;
};

const statusOptions = [
  { label: "Not started", value: "not_started" },
  { label: "In progress", value: "in_progress" },
  { label: "Done", value: "done" },
  { label: "Not applicable", value: "skipped" },
] as const satisfies readonly {
  label: string;
  value: TaskProgressStatus;
}[];

export function TaskStatusControl({
  taskId,
  status = "not_started",
  onStatusChange,
}: Readonly<TaskStatusControlProps>) {
  return (
    <div className="grid grid-cols-2 gap-2" aria-label="Task status">
      {statusOptions.map((option) => {
        const isSelected = status === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onStatusChange(taskId, option.value)}
            className={cn(
              "min-h-11 rounded-md border px-2 py-2 text-xs font-semibold leading-4 transition-colors",
              isSelected
                ? "border-teal-700 dark:border-teal-400/40 bg-teal-700 dark:bg-teal-400 dark:text-[#0f1a18] text-white"
                : "border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] text-zinc-700 dark:text-[#9fb0ad] hover:border-teal-700 dark:hover:border-teal-400/50 hover:bg-teal-50 dark:hover:bg-teal-400/10",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
