import Link from "next/link";

import type { Task } from "@/types/content";

type RelatedTasksProps = {
  tasks: readonly Task[];
};

export function RelatedTasks({ tasks }: Readonly<RelatedTasksProps>) {
  return (
    <section className="space-y-3 rounded-lg border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] p-4">
      <h3 className="text-base font-semibold text-zinc-950 dark:text-[#e7edeb]">
        Related checklist tasks
      </h3>
      <div className="grid gap-2">
        {tasks.map((task) => (
          <Link
            key={task.id}
            href={`/checklist/${task.id}`}
            className="rounded-md bg-zinc-50 dark:bg-white/5 px-3 py-3 text-sm font-semibold text-zinc-800 dark:text-[#e7edeb] transition-colors hover:bg-zinc-100 dark:hover:bg-white/10"
          >
            {task.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
