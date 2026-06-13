"use client";

import { useState } from "react";

import { AskContactCard } from "@/components/ask/AskContactCard";
import { FaqResultCard } from "@/components/ask/FaqResultCard";
import { useFaqSearch } from "@/hooks/useFaqSearch";
import { defaultFaqPrompts } from "@/lib/faq-search";
import { getAskContactsByIds } from "@/lib/content";

const fallbackContacts = getAskContactsByIds([
  "student_services",
  "university_international_office",
]);

export function FaqSearchClient() {
  const [query, setQuery] = useState("");
  const results = useFaqSearch(query);
  const hasQuery = query.trim().length > 0;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950">
          Ask
        </h2>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          Search curated answers from the onboarding guide.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border border-zinc-200 bg-white p-4">
        <label
          htmlFor="faq-search"
          className="text-sm font-semibold text-zinc-950"
        >
          Search common questions
        </label>
        <input
          id="faq-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search housing, BSN, insurance..."
          className="h-12 w-full rounded-md border border-zinc-300 bg-white px-3 text-base text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-teal-700"
        />
        <div className="flex flex-wrap gap-2">
          {defaultFaqPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => setQuery(prompt)}
              className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-xs font-semibold leading-5 text-zinc-700 transition-colors hover:bg-zinc-100"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <h3 className="text-lg font-semibold text-zinc-950">
            {hasQuery ? "Search results" : "Common questions"}
          </h3>
          {hasQuery ? (
            <p className="text-sm font-medium text-zinc-500">
              {results.length} found
            </p>
          ) : null}
        </div>

        {results.length > 0 ? (
          <div className="grid gap-3">
            {results.map((result) => (
              <FaqResultCard key={result.faq.id} result={result} />
            ))}
          </div>
        ) : (
          <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4">
            <h3 className="text-base font-semibold text-zinc-950">
              No matching FAQ found
            </h3>
            <p className="text-sm leading-6 text-zinc-600">
              Try a shorter search term such as housing, BSN, insurance, visa,
              DigiD, bank, or GP.
            </p>
          </div>
        )}
      </div>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-zinc-950">
          Where to ask next
        </h3>
        <div className="grid gap-3">
          {fallbackContacts.map((contact) => (
            <AskContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      </section>
    </section>
  );
}
