import { Pencil } from "lucide-react";
import Link from "next/link";

import type { StudentProfile } from "@/types/profile";

type SituationSummaryProps = {
  profile: StudentProfile;
};

const residencyLabels = {
  eu_eea_swiss: "EU/EEA/Swiss",
  non_eu_eea: "Non-EU/EEA",
  not_sure: "Not sure",
} as const;

const housingLabels = {
  confirmed: "Housing confirmed",
  searching: "Still searching",
  temporary_only: "Temporary housing only",
  not_started: "Not started",
} as const;

const arrivalLabels = {
  before_arrival: "Before arrival",
  already_arrived: "Already arrived",
} as const;

const bsnLabels = {
  yes: "BSN confirmed",
  no: "No BSN yet",
  not_sure: "BSN not sure",
} as const;

const workLabels = {
  yes: "Working or paid internship",
  no: "Not working",
  maybe: "Maybe working",
} as const;

export function SituationSummary({
  profile,
}: Readonly<SituationSummaryProps>) {
  const items = [
    residencyLabels[profile.residencyCategory],
    housingLabels[profile.housingStatus],
    arrivalLabels[profile.onboardingArrivalStatus],
    bsnLabels[profile.bsnStatus],
    workLabels[profile.workOrPaidInternship],
  ];

  return (
    <section className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-zinc-950">
          Your situation
        </h3>
        <Link
          href="/onboarding"
          aria-label="Edit your answers"
          className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-50"
        >
          <Pencil className="size-4" />
          Edit
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
