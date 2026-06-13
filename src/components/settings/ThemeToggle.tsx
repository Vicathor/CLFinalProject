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
    <section className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-zinc-950">Theme</h3>
        <div
          role="group"
          aria-label="Theme"
          className="flex gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1"
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
                    ? "bg-white text-teal-700 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-800",
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
