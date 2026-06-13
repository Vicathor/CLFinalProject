import faqsData from "@/data/faqs.json";
import type { FaqItem } from "@/types/content";

export type FaqSearchResult = {
  faq: FaqItem;
  score: number;
};

export const defaultFaqPrompts = [
  "I do not have housing yet",
  "I arrived but do not have a BSN",
  "Do I need health insurance?",
  "Who should I ask about my residence permit?",
  "How do I get DigiD?",
] as const;

const defaultFaqIds = [
  "faq_no_housing",
  "faq_bsn_no_address",
  "faq_health_insurance_work",
  "faq_need_mvv",
  "faq_digid_activation",
] as const;

const faqs = faqsData as FaqItem[];
const stopWords = new Set([
  "am",
  "an",
  "and",
  "are",
  "but",
  "can",
  "do",
  "for",
  "get",
  "has",
  "have",
  "how",
  "not",
  "no",
  "the",
  "this",
  "who",
  "why",
  "yet",
  "you",
]);

export function normalize(value: string) {
  return value.trim().toLowerCase().replace(/[-_/]+/g, " ");
}

export function getQueryTerms(query: string) {
  return normalize(query)
    .split(/\s+/)
    .filter((term) => term.length >= 2 && !stopWords.has(term));
}

function containsTerm(source: string, term: string) {
  return normalize(source).includes(term);
}

function scoreFaq(faq: FaqItem, query: string) {
  const normalizedQuery = normalize(query);
  const terms = getQueryTerms(query);

  if (!normalizedQuery || terms.length === 0) {
    return 0;
  }

  const relatedIds = [...faq.relatedTaskIds, ...faq.relatedTopicIds].join(" ");
  let score = 0;

  if (containsTerm(faq.question, normalizedQuery)) {
    score += 30;
  }

  if (containsTerm(faq.answer, normalizedQuery)) {
    score += 15;
  }

  if (faq.tags.some((tag) => containsTerm(tag, normalizedQuery))) {
    score += 15;
  }

  if (containsTerm(relatedIds, normalizedQuery)) {
    score += 5;
  }

  for (const term of terms) {
    if (containsTerm(faq.question, term)) {
      score += 10;
    }

    if (containsTerm(faq.answer, term)) {
      score += 6;
    }

    if (faq.tags.some((tag) => containsTerm(tag, term))) {
      score += 6;
    }

    if (containsTerm(relatedIds, term)) {
      score += 2;
    }
  }

  return score;
}

function asSearchResult(faq: FaqItem, score = 0): FaqSearchResult {
  return {
    faq,
    score,
  };
}

export function getDefaultFaqs(items: readonly FaqItem[] = faqs) {
  const faqsById = new Map(items.map((faq) => [faq.id, faq]));

  return defaultFaqIds.flatMap((id) => {
    const faq = faqsById.get(id);
    return faq ? [asSearchResult(faq)] : [];
  });
}

export function searchFaqs(query: string, items: readonly FaqItem[] = faqs) {
  if (!normalize(query)) {
    return getDefaultFaqs(items);
  }

  return items
    .map((faq) => asSearchResult(faq, scoreFaq(faq, query)))
    .filter((result) => result.score > 0)
    .sort((first, second) => {
      if (second.score !== first.score) {
        return second.score - first.score;
      }

      return first.faq.question.localeCompare(second.faq.question);
    });
}
