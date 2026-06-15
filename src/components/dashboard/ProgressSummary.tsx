import { ProgressBar } from "@/components/dashboard/ProgressBar";
import type { ProgressCalculation } from "@/lib/progress";

type ProgressSummaryProps = {
  progress: ProgressCalculation;
};

export function ProgressSummary({ progress }: Readonly<ProgressSummaryProps>) {
  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-zinc-950 dark:text-[#e7edeb]">Checklist</h3>
          <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-[#9fb0ad]">
            {progress.completedCount} of {progress.totalCount} recommended
            actions done
          </p>
        </div>
        <p className="text-2xl font-semibold text-zinc-950 dark:text-[#e7edeb]">
          {progress.percentage}%
        </p>
      </div>
      <ProgressBar percentage={progress.percentage} />
    </section>
  );
}
