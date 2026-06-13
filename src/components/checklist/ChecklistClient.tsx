"use client";

import Link from "next/link";
import { useMemo } from "react";

import { PhaseSection } from "@/components/checklist/PhaseSection";
import { useAppState } from "@/hooks/useAppState";
import { usePersonalisedTasks } from "@/hooks/usePersonalisedTasks";
import { sortPersonalisedTasks } from "@/lib/personalisation";
import type { TaskId, TaskPhase } from "@/types/content";
import type { TaskProgressStatus } from "@/types/progress";

const phaseLabels: Record<TaskPhase, string> = {
  before_arrival: "Before arrival",
  arrival_week: "Arrival week",
  first_month: "First month",
};

const phaseOrder: TaskPhase[] = [
  "before_arrival",
  "arrival_week",
  "first_month",
];

export function ChecklistClient() {
  const { profile, taskProgress, isHydrated, setTaskStatus } = useAppState();
  const personalisedTasks = usePersonalisedTasks(profile);
  const groupedTasks = useMemo(
    () =>
      phaseOrder.map((phase) => ({
        phase,
        tasks: sortPersonalisedTasks(
          personalisedTasks.filter((task) => task.phase === phase),
        ),
      })),
    [personalisedTasks],
  );

  function handleStatusChange(taskId: TaskId, status: TaskProgressStatus) {
    setTaskStatus(taskId, status);
  }

  if (!isHydrated) {
    return (
      <section className="space-y-5">
        <div>
          <h2 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950">
            Checklist
          </h2>
        </div>
        <div className="h-40 rounded-lg bg-zinc-100" />
        <div className="h-40 rounded-lg bg-zinc-100" />
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="space-y-5">
        <div>
          <h2 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950">
            Checklist
          </h2>
        </div>
        <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4">
          <h3 className="text-base font-semibold text-zinc-950">
            Personalise your checklist
          </h3>
          <p className="text-sm leading-6 text-zinc-600">
            Complete onboarding first so the checklist can rank tasks around
            your housing, arrival, BSN, work, and residency situation.
          </p>
          <Link
            href="/onboarding"
            className="flex h-12 w-full items-center justify-center rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
          >
            Start onboarding
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950">
          Checklist
        </h2>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Tasks are grouped by timing and ranked with your onboarding answers.
        </p>
      </div>

      {groupedTasks.map(({ phase, tasks }) => (
        <PhaseSection
          key={phase}
          title={phaseLabels[phase]}
          tasks={tasks}
          taskProgress={taskProgress}
          onStatusChange={handleStatusChange}
        />
      ))}
    </section>
  );
}
