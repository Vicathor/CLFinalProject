import communityData from "@/data/community-questions.json";
import faqsData from "@/data/faqs.json";
import { getQueryTerms, normalize, searchFaqs } from "@/lib/faq-search";
import type { FaqItem } from "@/types/content";
import type {
  AskAnswer,
  AskCategoryFilter,
  AskSort,
  AskThread,
} from "@/types/ask";

const OFFICIAL_AUTHOR = "University of Twente";
// Curated FAQs predate the community feed; give them a stable baseline date.
const OFFICIAL_DATE = "2026-01-15";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const faqs = faqsData as FaqItem[];
const communityThreads = communityData as AskThread[];

export const askSearchPrompts = [
  "housing",
  "BSN",
  "insurance",
  "DigiD",
  "bank",
  "GP",
  "bike",
] as const;

function officialThreadFromFaq(faq: FaqItem): AskThread {
  return {
    id: faq.id,
    category: "official",
    title: faq.question,
    authorName: OFFICIAL_AUTHOR,
    status: "approved",
    createdAt: OFFICIAL_DATE,
    tags: faq.tags,
    relatedTaskIds: faq.relatedTaskIds,
    relatedTopicIds: faq.relatedTopicIds,
    answers: [
      {
        id: `${faq.id}_official`,
        body: faq.answer,
        authorName: OFFICIAL_AUTHOR,
        verified: true,
        createdAt: OFFICIAL_DATE,
      },
    ],
  };
}

export function getOfficialThreads(): AskThread[] {
  return faqs.map(officialThreadFromFaq);
}

export function getCommunityThreads(): AskThread[] {
  return communityThreads;
}

// Curated/seed threads that ship with the app (no user-generated content).
export function getSeedThreads(): AskThread[] {
  return [...getCommunityThreads(), ...getOfficialThreads()].filter(
    (thread) => thread.status === "approved",
  );
}

export function getThreadById(id: string): AskThread | undefined {
  return getSeedThreads().find((thread) => thread.id === id);
}

// Combines seed threads with locally stored user questions and answers.
// User questions are prepended so the newest appears first within a day; user
// answers are appended to whichever thread (seed or user) they belong to.
export function mergeUserContent(
  seed: AskThread[],
  userQuestions: AskThread[],
  userAnswers: Record<string, AskAnswer[]>,
): AskThread[] {
  const combined = [
    ...userQuestions.filter((thread) => thread.status === "approved"),
    ...seed,
  ];

  return combined.map((thread) => {
    const extraAnswers = userAnswers[thread.id];

    if (!extraAnswers || extraAnswers.length === 0) {
      return thread;
    }

    return { ...thread, answers: [...thread.answers, ...extraAnswers] };
  });
}

// Official threads delegate to the tested FAQ scorer so search behaviour stays
// consistent; community threads use the same normalisation over their own text.
function communityMatches(thread: AskThread, query: string) {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return true;
  }

  const haystack = normalize(
    [
      thread.title,
      thread.body ?? "",
      thread.tags.join(" "),
      thread.answers.map((answer) => answer.body).join(" "),
    ].join(" "),
  );

  const terms = getQueryTerms(query);

  if (terms.length === 0) {
    return haystack.includes(normalizedQuery);
  }

  return terms.some((term) => haystack.includes(term));
}

export function sortThreads(threads: AskThread[], sort: AskSort): AskThread[] {
  const sorted = [...threads];

  if (sort === "most_answered") {
    sorted.sort((first, second) => {
      if (second.answers.length !== first.answers.length) {
        return second.answers.length - first.answers.length;
      }

      return second.createdAt.localeCompare(first.createdAt);
    });

    return sorted;
  }

  sorted.sort((first, second) => second.createdAt.localeCompare(first.createdAt));

  return sorted;
}

export function searchThreads(
  allThreads: AskThread[],
  query: string,
  category: AskCategoryFilter,
  sort: AskSort,
): AskThread[] {
  const trimmedQuery = query.trim();
  let threads = allThreads;

  if (category !== "all") {
    threads = threads.filter((thread) => thread.category === category);
  }

  if (trimmedQuery) {
    const officialMatchIds = new Set(
      searchFaqs(trimmedQuery).map((result) => result.faq.id),
    );

    threads = threads.filter((thread) =>
      thread.category === "official"
        ? officialMatchIds.has(thread.id)
        : communityMatches(thread, trimmedQuery),
    );
  }

  return sortThreads(threads, sort);
}

export function formatAskDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);

  if (!year || !month || !day) {
    return iso;
  }

  return `${day} ${MONTHS[month - 1]} ${year}`;
}
