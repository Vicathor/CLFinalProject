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
        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-[#9fb0ad]">
          Hi! We&apos;re Megumi, Sruthy, and Victor - three international
          students at the University of Twente who built this app as part of the
          Honours Change Leaders programme. We&apos;ve lived through the
          experience of moving to the Netherlands ourselves - the stress of
          finding housing, figuring out paperwork, and somehow doing all of it
          in the right order. We also talked to a lot of other international
          students along the way, and everyone had the same story. We made NL
          First 100 to be the friend who just tells you what
          you actually need to do.
        </p>
        <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-[#9fb0ad]">
          This is a prototype, so it&apos;s still a work in progress. Some
          features are basic for now and there&apos;s probably stuff we&apos;ve
          missed. We&apos;ve tried to pack in as much useful information as we
          could, but if something&apos;s missing or wrong, we genuinely want to
          know.
        </p>
      </div>

      <section className="space-y-3 rounded-lg border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] p-4">
        <h3 className="text-base font-semibold text-zinc-950 dark:text-[#e7edeb]">
          What it helps with
        </h3>
        <p className="text-sm leading-6 text-zinc-600 dark:text-[#9fb0ad]">
          It breaks your first 100 days in the Netherlands into clear,
          prioritised steps - housing, your visa and residence permit,
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
          How your data is stored
        </h3>
        <p className="text-sm leading-6 text-zinc-600 dark:text-[#9fb0ad]">
          No account is needed to use the app. Your profile, checklist progress,
          and feedback are saved in this browser on this device.
        </p>
        <p className="text-sm leading-6 text-zinc-600 dark:text-[#9fb0ad]">
          If you create an account, your onboarding answers are stored - useful
          if you switch devices or clear your browser. Posting and answering in
          the Ask community also requires an account.
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
