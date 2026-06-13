"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import contentMeta from "@/data/content-meta.json";
import {
  isLocalStorageAvailable,
  safeReadJson,
  safeRemove,
  safeWriteJson,
  STORAGE_KEYS,
} from "@/lib/storage";
import type { AskAnswer, AskThread } from "@/types/ask";
import type { FeedbackResponse, SaveFeedbackInput } from "@/types/feedback";
import type { Theme } from "@/types/theme";
import type { StudentProfile } from "@/types/profile";
import type { TaskProgress, TaskProgressStatus } from "@/types/progress";
import type { TaskId } from "@/types/content";

export type AppStateContextValue = {
  profile: StudentProfile | null;
  taskProgress: Record<string, TaskProgress>;
  feedbackResponses: FeedbackResponse[];
  askQuestions: AskThread[];
  askAnswers: Record<string, AskAnswer[]>;
  theme: Theme;
  onboardingCompleted: boolean;
  isHydrated: boolean;
  storageAvailable: boolean;
  setTheme: (theme: Theme) => void;
  saveProfile: (profile: StudentProfile) => void;
  resetProfile: () => void;
  setTaskStatus: (
    taskId: TaskId,
    status: TaskProgressStatus,
    notes?: string,
  ) => void;
  saveFeedback: (feedback: SaveFeedbackInput) => void;
  clearFeedback: () => void;
  addAskQuestion: (input: { title: string; body?: string }) => string;
  addAskAnswer: (threadId: string, body: string) => void;
  clearAllLocalData: () => void;
};

export const AppStateContext = createContext<AppStateContextValue | null>(null);

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${prefix}-${Date.now()}`;
}

// Local date as YYYY-MM-DD, matching the seed thread/answer date format.
function todayIsoDate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${now.getFullYear()}-${month}-${day}`;
}

export function AppStateProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [taskProgress, setTaskProgress] = useState<Record<string, TaskProgress>>(
    {},
  );
  const [feedbackResponses, setFeedbackResponses] = useState<
    FeedbackResponse[]
  >([]);
  const [askQuestions, setAskQuestions] = useState<AskThread[]>([]);
  const [askAnswers, setAskAnswers] = useState<Record<string, AskAnswer[]>>({});
  const [theme, setThemeState] = useState<Theme>("light");
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    queueMicrotask(() => {
      if (isCancelled) {
        return;
      }

      const available = isLocalStorageAvailable();
      const now = new Date().toISOString();

      setStorageAvailable(available);
      setProfile(
        safeReadJson<StudentProfile | null>(STORAGE_KEYS.profile, null),
      );
      setTaskProgress(
        safeReadJson<Record<string, TaskProgress>>(
          STORAGE_KEYS.taskProgress,
          {},
        ),
      );
      setFeedbackResponses(
        safeReadJson<FeedbackResponse[]>(STORAGE_KEYS.feedbackResponses, []),
      );
      setAskQuestions(
        safeReadJson<AskThread[]>(STORAGE_KEYS.askQuestions, []),
      );
      setAskAnswers(
        safeReadJson<Record<string, AskAnswer[]>>(STORAGE_KEYS.askAnswers, {}),
      );
      setThemeState(safeReadJson<Theme>(STORAGE_KEYS.theme, "light"));
      setOnboardingCompleted(
        safeReadJson<boolean>(STORAGE_KEYS.onboardingCompleted, false),
      );

      safeWriteJson(STORAGE_KEYS.contentVersion, contentMeta.version);
      safeWriteJson(STORAGE_KEYS.lastVisitedAt, now);
      setIsHydrated(true);
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  // Apply the theme as a class on <html> so dark styling can hook into it.
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setTheme = useCallback((nextTheme: Theme) => {
    const writeSucceeded = safeWriteJson(STORAGE_KEYS.theme, nextTheme);

    setThemeState(nextTheme);
    setStorageAvailable(writeSucceeded);
  }, []);

  const saveProfile = useCallback((nextProfile: StudentProfile) => {
    const writeSucceeded = safeWriteJson(STORAGE_KEYS.profile, nextProfile);
    const onboardingWriteSucceeded = safeWriteJson(
      STORAGE_KEYS.onboardingCompleted,
      true,
    );

    setProfile(nextProfile);
    setOnboardingCompleted(true);
    setStorageAvailable(writeSucceeded && onboardingWriteSucceeded);
  }, []);

  const resetProfile = useCallback(() => {
    const profileRemoved = safeRemove(STORAGE_KEYS.profile);
    const onboardingRemoved = safeRemove(STORAGE_KEYS.onboardingCompleted);

    setProfile(null);
    setOnboardingCompleted(false);
    setStorageAvailable(profileRemoved && onboardingRemoved);
  }, []);

  const setTaskStatus = useCallback(
    (taskId: TaskId, status: TaskProgressStatus, notes?: string) => {
      setTaskProgress((currentProgress) => {
        const now = new Date().toISOString();
        const nextProgress = {
          ...currentProgress,
          [taskId]: {
            taskId,
            status,
            updatedAt: now,
            completedAt: status === "done" ? now : undefined,
            notes,
          },
        };

        const writeSucceeded = safeWriteJson(
          STORAGE_KEYS.taskProgress,
          nextProgress,
        );
        setStorageAvailable(writeSucceeded);

        return nextProgress;
      });
    },
    [],
  );

  const saveFeedback = useCallback((feedback: SaveFeedbackInput) => {
    setFeedbackResponses((currentResponses) => {
      const nextFeedback: FeedbackResponse = {
        id: feedback.id ?? createId("feedback"),
        sourceType: feedback.sourceType,
        sourceId: feedback.sourceId,
        wasHelpful: feedback.wasHelpful,
        issueType: feedback.issueType,
        comment: feedback.comment,
        createdAt: feedback.createdAt ?? new Date().toISOString(),
        appContentVersion: feedback.appContentVersion ?? contentMeta.version,
        profileSnapshot: feedback.profileSnapshot ?? profile,
      };
      const nextResponses = [...currentResponses, nextFeedback];
      const writeSucceeded = safeWriteJson(
        STORAGE_KEYS.feedbackResponses,
        nextResponses,
      );

      setStorageAvailable(writeSucceeded);
      return nextResponses;
    });
  }, [profile]);

  const clearFeedback = useCallback(() => {
    const removed = safeRemove(STORAGE_KEYS.feedbackResponses);

    setFeedbackResponses([]);
    setStorageAvailable(removed);
  }, []);

  const addAskQuestion = useCallback(
    (input: { title: string; body?: string }) => {
      const id = createId("ask-question");
      const trimmedBody = input.body?.trim();
      const question: AskThread = {
        id,
        category: "community",
        title: input.title.trim(),
        body: trimmedBody ? trimmedBody : undefined,
        authorName: "You",
        status: "approved",
        createdAt: todayIsoDate(),
        tags: [],
        relatedTaskIds: [],
        relatedTopicIds: [],
        answers: [],
      };

      setAskQuestions((currentQuestions) => {
        const nextQuestions = [question, ...currentQuestions];
        const writeSucceeded = safeWriteJson(
          STORAGE_KEYS.askQuestions,
          nextQuestions,
        );

        setStorageAvailable(writeSucceeded);
        return nextQuestions;
      });

      return id;
    },
    [],
  );

  const addAskAnswer = useCallback((threadId: string, body: string) => {
    const trimmedBody = body.trim();

    if (!trimmedBody) {
      return;
    }

    const answer: AskAnswer = {
      id: createId("ask-answer"),
      body: trimmedBody,
      authorName: "You",
      verified: false,
      createdAt: todayIsoDate(),
    };

    setAskAnswers((currentAnswers) => {
      const nextAnswers = {
        ...currentAnswers,
        [threadId]: [...(currentAnswers[threadId] ?? []), answer],
      };
      const writeSucceeded = safeWriteJson(
        STORAGE_KEYS.askAnswers,
        nextAnswers,
      );

      setStorageAvailable(writeSucceeded);
      return nextAnswers;
    });
  }, []);

  const clearAllLocalData = useCallback(() => {
    const results = Object.values(STORAGE_KEYS).map((key) => safeRemove(key));

    setProfile(null);
    setTaskProgress({});
    setFeedbackResponses([]);
    setAskQuestions([]);
    setAskAnswers({});
    setThemeState("light");
    setOnboardingCompleted(false);
    setStorageAvailable(results.every(Boolean));
  }, []);

  const contextValue = useMemo<AppStateContextValue>(
    () => ({
      profile,
      taskProgress,
      feedbackResponses,
      askQuestions,
      askAnswers,
      theme,
      onboardingCompleted,
      isHydrated,
      storageAvailable,
      setTheme,
      saveProfile,
      resetProfile,
      setTaskStatus,
      saveFeedback,
      clearFeedback,
      addAskQuestion,
      addAskAnswer,
      clearAllLocalData,
    }),
    [
      addAskAnswer,
      addAskQuestion,
      askAnswers,
      askQuestions,
      clearAllLocalData,
      clearFeedback,
      feedbackResponses,
      isHydrated,
      onboardingCompleted,
      profile,
      resetProfile,
      saveFeedback,
      saveProfile,
      setTaskStatus,
      setTheme,
      storageAvailable,
      taskProgress,
      theme,
    ],
  );

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  );
}
