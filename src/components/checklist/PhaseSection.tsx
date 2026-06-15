"use client";

import { TaskCard } from "@/components/checklist/TaskCard";
import type { PersonalisedTask } from "@/lib/personalisation";
import type { TaskId } from "@/types/content";
import type { TaskProgress, TaskProgressStatus } from "@/types/progress";

type PhaseSectionProps = {
  title: string;
  tasks: readonly PersonalisedTask[];
  taskProgress: Record<string, TaskProgress>;
  onStatusChange: (taskId: TaskId, status: TaskProgressStatus) => void;
};

export function PhaseSection({
  title,
  tasks,
  taskProgress,
  onStatusChange,
}: Readonly<PhaseSectionProps>) {
  if (tasks.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-zinc-950 dark:text-[#e7edeb]">{title}</h3>
        <span className="text-sm font-medium text-zinc-500 dark:text-[#9fb0ad]">
          {tasks.length}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            status={taskProgress[task.id]?.status}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </section>
  );
}
