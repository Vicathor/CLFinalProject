"use client";

import { Moon, Sun } from "lucide-react";

import { useAppState } from "@/hooks/useAppState";
import { cn } from "@/lib/utils";
import type { Theme } from "@/types/theme";

const options = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
] as const satisfies ReadonlyArray<{
  value: Theme;
  label: string;
  Icon: typeof Sun;
}>;

export function ThemeToggle() {
  const { theme, setTheme, isHydrated } = useAppState();

  return (
    <section className="rounded-lg border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-zinc-950 dark:text-[#e7edeb]">Theme</h3>
        <div
          role="group"
          aria-label="Theme"
          className="flex gap-1 rounded-lg border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-white/5 p-1"
        >
          {options.map(({ value, label, Icon }) => {
            const isActive = isHydrated && theme === value;

            return (
              <button
                key={value}
                type="button"
                aria-label={label}
                aria-pressed={isActive}
                onClick={() => setTheme(value)}
                className={cn(
                  "flex size-9 items-center justify-center rounded-md transition-colors",
                  isActive
                    ? "bg-white dark:bg-[#18221f] text-teal-700 dark:text-teal-400 shadow-sm"
                    : "text-zinc-500 dark:text-[#9fb0ad] hover:text-zinc-800 dark:hover:text-[#e7edeb]",
                )}
              >
                <Icon className="size-4" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
