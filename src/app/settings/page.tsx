import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { ClearDataButton } from "@/components/settings/ClearDataButton";
import { ThemeToggle } from "@/components/settings/ThemeToggle";

const APP_VERSION = "0.1.0";

export default function SettingsPage() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950">
          Settings
        </h2>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Manage your preferences and data on this device.
        </p>
      </div>

      <ThemeToggle />

      <FeedbackForm
        sourceType="general"
        title="General feedback"
        helpfulnessPrompt="What do you think of this app?"
      />

      <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <Link
          href="/settings/my-feedback"
          className="flex items-center justify-between gap-3 p-4 transition-colors hover:bg-zinc-50"
        >
          <span className="text-sm font-semibold text-zinc-800">
            My feedback
          </span>
          <ChevronRight className="size-5 shrink-0 text-zinc-400" />
        </Link>
        <Link
          href="/settings/about"
          className="flex items-center justify-between gap-3 border-t border-zinc-100 p-4 transition-colors hover:bg-zinc-50"
        >
          <span className="text-sm font-semibold text-zinc-800">
            About the app
          </span>
          <ChevronRight className="size-5 shrink-0 text-zinc-400" />
        </Link>
      </section>

      <ClearDataButton />

      <p className="text-center text-xs text-zinc-400">
        Beta · v{APP_VERSION}
      </p>
    </section>
  );
}
