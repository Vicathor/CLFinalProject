import type { StorageKey } from "@/types/storage";

export const STORAGE_KEYS = {
  profile: "nlFirst100:v1:profile",
  taskProgress: "nlFirst100:v1:taskProgress",
  feedbackResponses: "nlFirst100:v1:feedbackResponses",
  theme: "nlFirst100:v1:theme",
  askQuestions: "nlFirst100:v1:askQuestions",
  askAnswers: "nlFirst100:v1:askAnswers",
  onboardingCompleted: "nlFirst100:v1:onboardingCompleted",
  contentVersion: "nlFirst100:v1:contentVersion",
  lastVisitedAt: "nlFirst100:v1:lastVisitedAt",
} as const satisfies Record<string, StorageKey>;

function getLocalStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function isLocalStorageAvailable() {
  const storage = getLocalStorage();

  if (!storage) {
    return false;
  }

  const testKey = "nlFirst100:v1:storageTest";

  try {
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function safeReadJson<T>(key: StorageKey, fallback: T): T {
  const storage = getLocalStorage();

  if (!storage) {
    return fallback;
  }

  try {
    const rawValue = storage.getItem(key);

    if (rawValue === null) {
      return fallback;
    }

    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

export function safeWriteJson<T>(key: StorageKey, value: T) {
  const storage = getLocalStorage();

  if (!storage) {
    return false;
  }

  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function safeRemove(key: StorageKey) {
  const storage = getLocalStorage();

  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
