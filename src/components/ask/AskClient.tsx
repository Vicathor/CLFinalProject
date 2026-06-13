"use client";

import { ListFilter, MessageSquarePlus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { AskContactCard } from "@/components/ask/AskContactCard";
import { QuestionCard } from "@/components/ask/QuestionCard";
import { useAppState } from "@/hooks/useAppState";
import {
  askSearchPrompts,
  getSeedThreads,
  mergeUserContent,
  searchThreads,
} from "@/lib/ask";
import { getAskContactsByIds } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { AskCategoryFilter, AskSort } from "@/types/ask";

const fallbackContacts = getAskContactsByIds([
  "student_services",
  "university_international_office",
]);

const categoryTabs = [
  { value: "all", label: "All" },
  { value: "community", label: "Community" },
  { value: "official", label: "Official FAQs" },
] as const satisfies ReadonlyArray<{ value: AskCategoryFilter; label: string }>;

export function AskClient() {
  const { askQuestions, askAnswers, isHydrated } = useAppState();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<AskCategoryFilter>("all");
  const [sort, setSort] = useState<AskSort>("newest");

  const threads = useMemo(() => {
    const allThreads = mergeUserContent(
      getSeedThreads(),
      isHydrated ? askQuestions : [],
      isHydrated ? askAnswers : {},
    );

    return searchThreads(allThreads, query, category, sort);
  }, [askAnswers, askQuestions, category, isHydrated, query, sort]);
  const hasQuery = query.trim().length > 0;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950">
          Ask
        </h2>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Browse questions from other international students, or post your own.
        </p>
      </div>

      <Link
        href="/ask/new"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
      >
        <MessageSquarePlus className="size-4" />
        Ask a question
      </Link>

      <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4">
        <label
          htmlFor="ask-search"
          className="text-sm font-semibold text-zinc-950"
        >
          Search questions
        </label>
        <input
          id="ask-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search housing, BSN, insurance..."
          className="h-12 w-full rounded-md border border-zinc-300 bg-white px-3 text-base text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-teal-700"
        />
        <div className="flex flex-wrap gap-2">
          {askSearchPrompts.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setQuery(suggestion)}
              className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-xs font-semibold leading-5 text-zinc-700 transition-colors hover:bg-zinc-100"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Filter questions by category"
        className="grid grid-cols-3 gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-1"
      >
        {categoryTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={category === tab.value}
            onClick={() => setCategory(tab.value)}
            className={cn(
              "h-9 rounded-md text-sm font-semibold transition-colors",
              category === tab.value
                ? "bg-white text-teal-700 shadow-sm"
                : "text-zinc-500 hover:text-zinc-800",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-zinc-950">
            {hasQuery ? "Results" : "Questions"}{" "}
            <span className="text-sm font-medium text-zinc-500">
              ({threads.length})
            </span>
          </h3>
          <label className="flex items-center gap-1.5 text-sm text-zinc-500">
            <ListFilter className="size-4 shrink-0" />
            <span className="sr-only">Sort questions</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as AskSort)}
              className="rounded-md border border-zinc-200 bg-white py-1 pl-2 pr-1 text-sm font-medium text-zinc-700 outline-none focus:border-teal-700"
            >
              <option value="newest">Newest</option>
              <option value="most_answered">Most answered</option>
            </select>
          </label>
        </div>

        {threads.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {threads.map((thread) => (
              <QuestionCard key={thread.id} thread={thread} />
            ))}
          </div>
        ) : (
          <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4">
            <h3 className="text-base font-semibold text-zinc-950">
              No questions found
            </h3>
            <p className="text-sm leading-6 text-zinc-600">
              Try a shorter search term such as housing, BSN, insurance, visa,
              DigiD, bank, or GP — or ask a new question.
            </p>
          </div>
        )}
      </div>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-zinc-950">
          Where to ask next
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {fallbackContacts.map((contact) => (
            <AskContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      </section>

    </section>
  );
}
