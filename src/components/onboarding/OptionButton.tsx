"use client";

import { cn } from "@/lib/utils";

type OptionButtonProps = {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
};

export function OptionButton({
  label,
  isSelected,
  onSelect,
}: Readonly<OptionButtonProps>) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onSelect}
      className={cn(
        "min-h-12 w-full rounded-md border px-4 py-3 text-left text-sm font-medium leading-5 transition-colors",
        isSelected
          ? "border-teal-700 dark:border-teal-400/40 bg-teal-700 dark:bg-teal-400 dark:text-[#0f1a18] text-white"
          : "border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] text-zinc-800 dark:text-[#e7edeb] hover:border-teal-700 dark:hover:border-teal-400/50 hover:bg-teal-50 dark:hover:bg-teal-400/10",
      )}
    >
      {label}
    </button>
  );
}
