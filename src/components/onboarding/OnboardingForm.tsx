"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAppState } from "@/hooks/useAppState";
import { cn } from "@/lib/utils";
import type {
  BsnStatus,
  HousingStatus,
  OnboardingArrivalStatus,
  ResidencyCategory,
  StudentProfile,
} from "@/types/profile";

type OnboardingAnswers = {
  residencyCategory?: ResidencyCategory;
  housingStatus?: HousingStatus;
  onboardingArrivalStatus?: OnboardingArrivalStatus;
  bsnStatus?: BsnStatus;
};

type StepConfig = {
  key: keyof OnboardingAnswers;
  title: string;
  subtitle: string;
  // Illustration file in /public/illustrations, drawn on the teal hero.
  illustration: string;
  options: readonly { label: string; value: string }[];
};

const steps: readonly StepConfig[] = [
  {
    key: "residencyCategory",
    title: "Where are you coming from?",
    subtitle: "This shapes your visa and registration steps.",
    illustration: "/illustrations/step1.svg",
    options: [
      { label: "EU / EEA / Swiss", value: "eu_eea_swiss" },
      { label: "Non-EU / EEA", value: "non_eu_eea" },
    ],
  },
  {
    key: "housingStatus",
    title: "How's your housing?",
    subtitle: "We'll prioritise what you still need to sort out.",
    illustration: "/illustrations/step2.svg",
    options: [
      { label: "I have housing", value: "confirmed" },
      { label: "Still searching", value: "searching" },
      { label: "Temporary housing only", value: "temporary_only" },
      { label: "Not started", value: "not_started" },
    ],
  },
  {
    key: "onboardingArrivalStatus",
    title: "Have you arrived yet?",
    subtitle: "Your timeline shapes the very first steps.",
    illustration: "/illustrations/step3.svg",
    options: [
      { label: "Yes", value: "already_arrived" },
      { label: "No", value: "before_arrival" },
    ],
  },
  {
    key: "bsnStatus",
    title: "Do you have a BSN?",
    subtitle: "Your citizen service number unlocks many services.",
    illustration: "/illustrations/step4.svg",
    options: [
      { label: "Yes, I have one", value: "yes" },
      { label: "Not yet", value: "no" },
      { label: "Not sure", value: "not_sure" },
    ],
  },
];

function isComplete(answers: OnboardingAnswers) {
  return Boolean(
    answers.residencyCategory &&
      answers.housingStatus &&
      answers.onboardingArrivalStatus &&
      answers.bsnStatus,
  );
}

function createProfile(answers: Required<OnboardingAnswers>): StudentProfile {
  const now = new Date().toISOString();

  return {
    id: `profile-${Date.now()}`,
    residencyCategory: answers.residencyCategory,
    nationalityGroup:
      answers.residencyCategory === "not_sure"
        ? undefined
        : answers.residencyCategory === "eu_eea_swiss"
          ? "eu_eea_swiss"
          : "non_eu_eea_swiss",
    onboardingArrivalStatus: answers.onboardingArrivalStatus,
    arrivalStatus:
      answers.onboardingArrivalStatus === "before_arrival"
        ? "planning"
        : "arrived",
    housingStatus: answers.housingStatus,
    bsnStatus: answers.bsnStatus,
    hasHousing: answers.housingStatus === "confirmed",
    hasBsn: answers.bsnStatus === "yes",
    needsVisaOrResidencePermit:
      answers.residencyCategory === "non_eu_eea" ? true : undefined,
    insuranceSituation: "unknown",
    hasDutchBankAccount: false,
    hasDutchPhoneNumber: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function OnboardingForm() {
  const router = useRouter();
  const { saveProfile, storageAvailable, isHydrated } = useAppState();
  const [answers, setAnswers] = useState<OnboardingAnswers>({});
  const [stepIndex, setStepIndex] = useState(0);

  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  function selectOption(value: string) {
    const updated = { ...answers, [step.key]: value };
    setAnswers(updated);

    if (!isLastStep) {
      setStepIndex((index) => index + 1);
      return;
    }

    if (isComplete(updated)) {
      saveProfile(createProfile(updated as Required<OnboardingAnswers>));
      router.push("/dashboard");
    }
  }

  function goBack() {
    if (stepIndex === 0) {
      router.push("/");
      return;
    }
    setStepIndex((index) => Math.max(0, index - 1));
  }

  return (
    <div className="-mx-5 -mt-6 flex min-h-[calc(100dvh-73px)] flex-col">
      {/* Progress bar */}
      <div className="px-5 pt-5">
        <div className="relative h-3 rounded-full bg-zinc-200 dark:bg-white/10">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-teal-700 dark:bg-teal-400 transition-[width] duration-500 ease-out"
            style={{
              width:
                stepIndex === steps.length - 1
                  ? "100%"
                  : `calc(${((stepIndex + 1) / steps.length) * 100}% + 6px)`,
            }}
          />
          {steps.slice(0, -1).map((segment, index) => (
            <span
              key={segment.key}
              className={cn(
                "absolute top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-300",
                index <= stepIndex ? "bg-white" : "bg-zinc-400 dark:bg-white/30",
              )}
              style={{ left: `${((index + 1) / steps.length) * 100}%` }}
            />
          ))}
        </div>
      </div>

      {/* Animated step: hero + content transition in together as one unit,
          both on first mount (arriving from the startup screen) and on every
          step change. */}
      <div key={step.key} className="animate-step-in flex flex-1 flex-col">
        {/* Hero */}
        <div className="mt-4 flex h-60 items-center justify-center">
          <Image
            src={step.illustration}
            alt=""
            aria-hidden
            width={240}
            height={160}
            priority
            className="h-60 w-auto"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-400">
          Step {stepIndex + 1} of {steps.length}
        </p>
        <h2 className="mt-1 text-2xl font-semibold leading-tight text-zinc-950 dark:text-[#e7edeb]">
          {step.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-[#9fb0ad]">{step.subtitle}</p>

        <div className="mt-5 grid gap-3">
          {step.options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => selectOption(option.value)}
              className="group flex min-h-13 w-full items-center justify-between gap-3 rounded-full border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#18221f] px-5 py-3 text-left text-sm font-medium text-zinc-800 dark:text-[#e7edeb] shadow-sm transition-all hover:border-teal-300 hover:bg-teal-50 dark:hover:bg-teal-400/10"
            >
              <span>{option.label}</span>
              <ChevronRight className="size-5 shrink-0 text-zinc-300 transition-colors group-hover:text-teal-600" />
            </button>
          ))}
        </div>

        {isHydrated && !storageAvailable ? (
          <p className="mt-4 text-sm leading-6 text-red-700 dark:text-red-400">
            Local browser storage is unavailable, so your answers may not persist
            after reload.
          </p>
        ) : null}

          {/* Navigation */}
          <div className="mt-auto pt-6">
            <button
              type="button"
              onClick={goBack}
              className="-ml-2 flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-zinc-400 dark:text-[#7e908c] transition-colors hover:text-zinc-700 dark:hover:text-[#e7edeb]"
            >
              <ChevronLeft className="size-4" />
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
