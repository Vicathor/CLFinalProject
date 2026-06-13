import type { TaskId, TopicId } from "@/types/content";

export type AskCategory = "official" | "community";

export type AskCategoryFilter = AskCategory | "all";

export type AskSort = "newest" | "most_answered";

export type AskAnswer = {
  id: string;
  body: string;
  authorName: string;
  // Verified answers come from university staff or official sources.
  verified: boolean;
  createdAt: string; // ISO date (YYYY-MM-DD)
};

export type AskThread = {
  id: string;
  category: AskCategory;
  // The question itself.
  title: string;
  // Optional extra context the asker provides (community questions only).
  body?: string;
  authorName: string;
  // Moderation state. Only "approved" threads are shown publicly.
  status: "approved" | "pending";
  createdAt: string; // ISO date (YYYY-MM-DD)
  tags: string[];
  relatedTaskIds: TaskId[];
  relatedTopicIds: TopicId[];
  answers: AskAnswer[];
};
