"use client";

import {
  ArrowRight,
  ClipboardCheck,
  Compass,
  GraduationCap,
  type LucideIcon,
  MessageSquareText,
} from "lucide-react";
import Link from "next/link";

import { useAppState } from "@/hooks/useAppState";

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: ClipboardCheck,
    title: "A checklist made for you",
    description: "Tailored to your housing, visa, and BSN situation.",
  },
  {
    icon: Compass,
    title: "Guided, step by step",
    description: "Know what to do first, and what can wait.",
  },
  {
    icon: MessageSquareText,
    title: "Answers when you need them",
    description: "Ask questions about settling into student life.",
  },
];

export default function Home() {
  const { profile, isHydrated, clearAllLocalData } = useAppState();
  const hasProfile = Boolean(profile);

  return (
    <div className="animate-screen-in -mx-5 -mt-6">
      {/* Hero */}
      <div className="relative overflow-hidden bg-teal-700 px-6 pb-16 pt-12 text-white">
        <div className="relative">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
            <GraduationCap className="size-7" strokeWidth={1.75} />
          </span>
          <p className="mt-6 text-sm font-medium text-teal-100">
            Welcome to your student guide
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight">
            Your first 100 days in the Netherlands, sorted.
          </h1>
          <p className="mt-3 text-sm leading-6 text-teal-50/90">
            A friendly, step-by-step companion for international students
            settling into life and study here.
          </p>
        </div>

        {/* Curved divider */}
        <div className="absolute inset-x-0 -bottom-px h-10 rounded-t-[2.5rem] bg-[#fbfcf8]" />
      </div>

      {/* Body */}
      <div className="px-5 pb-8 pt-6">
        <ul className="space-y-3">
          {features.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Icon className="size-5.5" strokeWidth={1.9} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-950">{title}</p>
                <p className="mt-0.5 text-sm leading-5 text-zinc-500">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mt-7 space-y-3">
          {!isHydrated ? (
            <div className="h-14 rounded-full bg-zinc-100" />
          ) : (
            <>
              <Link
                href={hasProfile ? "/dashboard" : "/onboarding"}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-teal-700 px-6 text-base font-semibold text-white shadow-lg shadow-teal-700/25 transition-colors hover:bg-teal-800"
              >
                {hasProfile ? "Continue to dashboard" : "Get started"}
                <ArrowRight className="size-5" />
              </Link>
              {hasProfile ? (
                <button
                  type="button"
                  onClick={clearAllLocalData}
                  className="h-11 w-full rounded-full text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-700"
                >
                  Clear local data
                </button>
              ) : null}
            </>
          )}
        </div>

        <p className="pt-5 text-center text-xs text-zinc-400">
          Your progress is saved only in this browser.
        </p>
      </div>
    </div>
  );
}
