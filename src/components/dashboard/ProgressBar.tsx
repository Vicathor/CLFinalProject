type ProgressBarProps = {
  percentage: number;
};

export function ProgressBar({ percentage }: Readonly<ProgressBarProps>) {
  const boundedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div
      aria-label={`Progress ${boundedPercentage}%`}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={boundedPercentage}
      role="progressbar"
      className="h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10"
    >
      <div
        className="h-full rounded-full bg-teal-700 dark:bg-teal-400 dark:text-[#0f1a18] transition-[width]"
        style={{ width: `${boundedPercentage}%` }}
      />
    </div>
  );
}
