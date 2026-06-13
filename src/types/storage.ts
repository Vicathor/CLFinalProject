import type { FeedbackResponse } from "@/types/feedback";
import type { StudentProfile } from "@/types/profile";
import type { TaskProgress } from "@/types/progress";

export type StorageKey =
  | "nlFirst100:v1:profile"
  | "nlFirst100:v1:taskProgress"
  | "nlFirst100:v1:feedbackResponses"
  | "nlFirst100:v1:theme"
  | "nlFirst100:v1:askQuestions"
  | "nlFirst100:v1:askAnswers"
  | "nlFirst100:v1:onboardingCompleted"
  | "nlFirst100:v1:contentVersion"
  | "nlFirst100:v1:lastVisitedAt";

export type StoredProfile = StudentProfile;

export type StoredTaskProgress = Record<string, TaskProgress>;

export type StoredFeedbackResponses = FeedbackResponse[];

export type AppStorageState = {
  profile?: StoredProfile;
  taskProgress: StoredTaskProgress;
  feedbackResponses: StoredFeedbackResponses;
  onboardingCompleted: boolean;
  contentVersion?: string;
  lastVisitedAt?: string;
};
