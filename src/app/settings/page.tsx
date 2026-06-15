import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { AccountSection } from "@/components/settings/AccountSection";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { ThemeToggle } from "@/components/settings/ThemeToggle";

const APP_VERSION = "0.1.0";

export default function SettingsPage() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950 dark:text-[#e7edeb]">
          Settings
        </h2>
        <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-[#9fb0ad]">
          Manage your preferences and data on this device.
        </p>
      </div>

      <AccountSection />

      <ThemeToggle />

      <FeedbackForm
        sourceType="general"
        title="General feedback"
        helpfulnessPrompt="What do you think of this app?"
      />

      <section className="overflow-hidden rounded-lg border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f]">
        <Link
          href="/settings/about"
          className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-white/5"
        >
          <span className="text-sm font-semibold text-zinc-800 dark:text-[#e7edeb]">
            About the app
          </span>
          <ChevronRight className="size-5 shrink-0 text-zinc-400 dark:text-[#7e908c]" />
        </Link>
      </section>

      <p className="text-center text-xs text-zinc-400 dark:text-[#7e908c]">
        Beta · v{APP_VERSION}
      </p>
    </section>
  );
}
