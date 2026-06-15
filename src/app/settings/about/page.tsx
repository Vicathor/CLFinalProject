import Link from "next/link";

export default function AboutPage() {
  return (
    <section className="space-y-6">
      <Link
        href="/settings"
        className="text-sm font-semibold text-teal-800 dark:text-teal-400 underline decoration-2 underline-offset-4"
      >
        Back to Settings
      </Link>

      <div>
        <h2 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950 dark:text-[#e7edeb]">
          About the app
        </h2>
        <p className="mt-3 text-base leading-7 text-zinc-600 dark:text-[#9fb0ad]">
          NL First 100 is a mobile-first onboarding guide for international
          students settling into the University of Twente. This project is part
          of the Change Leaders Honours programme.
        </p>
      </div>

      <section className="space-y-3 rounded-lg border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] p-4">
        <h3 className="text-base font-semibold text-zinc-950 dark:text-[#e7edeb]">
          What it helps with
        </h3>
        <p className="text-sm leading-6 text-zinc-600 dark:text-[#9fb0ad]">
          It breaks your first 100 days in the Netherlands into clear,
          prioritised steps — housing, your visa and residence permit,
          municipality registration and BSN, banking, health insurance and
          registering with a GP, and getting around day to day.
        </p>
      </section>

      <section className="space-y-3 rounded-lg border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] p-4">
        <h3 className="text-base font-semibold text-zinc-950 dark:text-[#e7edeb]">How it works</h3>
        <p className="text-sm leading-6 text-zinc-600 dark:text-[#9fb0ad]">
          Answer a few quick questions during onboarding and the dashboard
          tailors a checklist to your situation. Browse Topics for deeper
          guidance, and use Ask to search questions from other students or post
          your own.
        </p>
      </section>

      <section className="space-y-3 rounded-lg border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] p-4">
        <h3 className="text-base font-semibold text-zinc-950 dark:text-[#e7edeb]">
          Your data stays with you
        </h3>
        <p className="text-sm leading-6 text-zinc-600 dark:text-[#9fb0ad]">
          No account is needed. Your profile, progress, and feedback are saved
          only in this browser on this device, and you can clear them at any time
          from Settings.
        </p>
      </section>

      <p className="text-sm leading-6 text-zinc-500 dark:text-[#9fb0ad]">
        This is an early beta. Official sources are linked throughout, but always
        confirm details with the university and Dutch authorities for your own
        situation.
      </p>
    </section>
  );
}
