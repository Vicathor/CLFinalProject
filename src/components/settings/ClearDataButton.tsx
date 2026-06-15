"use client";

import { useAppState } from "@/hooks/useAppState";

export function ClearDataButton() {
  const { clearAllLocalData } = useAppState();

  function handleClear() {
    const confirmed = window.confirm(
      "Clear all locally saved data on this device? This removes your profile, checklist progress, feedback, and posts. This cannot be undone.",
    );

    if (confirmed) {
      clearAllLocalData();
    }
  }

  return (
    <button
      type="button"
      onClick={handleClear}
      className="h-11 w-full rounded-md text-sm font-semibold text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950/40"
    >
      Clear local data
    </button>
  );
}
