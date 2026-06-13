"use client";

import Link from "next/link";

import { NextActions } from "@/components/dashboard/NextActions";
import { ProgressSummary } from "@/components/dashboard/ProgressSummary";
import { SituationSummary } from "@/components/dashboard/SituationSummary";
import { useAppState } from "@/hooks/useAppState";
import { usePersonalisedTasks } from "@/hooks/usePersonalisedTasks";
import { getTopNextActions } from "@/lib/personalisation";
import { calculateProgress } from "@/lib/progress";
import type { TaskId } from "@/types/content";

function isHousingUnresolved(housingStatus: string) {
  return housingStatus !== "confirmed";
}

export function DashboardClient() {
  const { profile, taskProgress, isHydrated, setTaskStatus } = useAppState();
  const personalisedTasks = usePersonalisedTasks(profile);
  const progress = calculateProgress(personalisedTasks, taskProgress);
  const nextActions = getTopNextActions(personalisedTasks, taskProgress, 3);

  function handleMarkDone(taskId: TaskId) {
    setTaskStatus(taskId, "done");
  }

  if (!isHydrated) {
    return (
      <section className="space-y-5">
        <div>
          <h2 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950">
            Dashboard
          </h2>
        </div>
        <div className="h-32 rounded-lg bg-zinc-100" />
        <div className="h-48 rounded-lg bg-zinc-100" />
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="space-y-5">
        <div>
          <h2 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950">
            Dashboard
          </h2>
        </div>
        <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4">
          <h3 className="text-base font-semibold text-zinc-950">
            Start with your situation
          </h3>
          <p className="text-sm leading-6 text-zinc-600">
            Answer five quick questions so the dashboard can prioritise urgent
            tasks and next actions.
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
    <section className="space-y-5">
      <div>
        <h2 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950">
          Dashboard
        </h2>
      </div>

      {isHousingUnresolved(profile.housingStatus) ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="font-semibold text-red-900">Housing needs attention</p>
          <p className="mt-1 text-sm leading-6 text-red-800">
            Your housing is not fully resolved, so Housing SOS is treated as an
            urgent task.
          </p>
        </div>
      ) : null}

      <SituationSummary profile={profile} />
      <ProgressSummary progress={progress} />
      <NextActions tasks={nextActions} onMarkDone={handleMarkDone} />
    </section>
  );
}
