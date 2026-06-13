import { ProgressBar } from "@/components/dashboard/ProgressBar";
import type { ProgressCalculation } from "@/lib/progress";

type ProgressSummaryProps = {
  progress: ProgressCalculation;
};

export function ProgressSummary({ progress }: Readonly<ProgressSummaryProps>) {
  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-zinc-950">Checklist</h3>
          <p className="mt-1 text-sm leading-6 text-zinc-600">
            {progress.completedCount} of {progress.totalCount} recommended
            actions done
          </p>
        </div>
        <p className="text-2xl font-semibold text-zinc-950">
          {progress.percentage}%
        </p>
      </div>
      <ProgressBar percentage={progress.percentage} />
    </section>
  );
}
