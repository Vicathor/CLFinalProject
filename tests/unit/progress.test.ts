import { describe, expect, it } from "vitest";

import { getAllTasks } from "@/lib/content";
import { getPersonalisedTasks } from "@/lib/personalisation";
import { calculateProgress } from "@/lib/progress";
import type { StudentProfile } from "@/types/profile";
import type { TaskProgress } from "@/types/progress";

const arrivedWithoutBsnProfile: StudentProfile = {
  id: "arrived-without-bsn",
  residencyCategory: "eu_eea_swiss",
  housingStatus: "temporary_only",
  onboardingArrivalStatus: "already_arrived",
  bsnStatus: "no",
  hasHousing: false,
  hasBsn: false,
  createdAt: "2026-06-07T00:00:00.000Z",
  updatedAt: "2026-06-07T00:00:00.000Z",
};

describe("progress", () => {
  it("handles missing or empty progress", () => {
    const tasks = getPersonalisedTasks(getAllTasks(), arrivedWithoutBsnProfile);

    expect(calculateProgress(tasks, {})).toMatchObject({
      completedCount: 0,
      urgentRemainingCount: 3,
      percentage: 0,
    });
  });

  it("updates completed count and percentage when tasks are marked done", () => {
    const tasks = getPersonalisedTasks(getAllTasks(), arrivedWithoutBsnProfile);
    const progress: Record<string, TaskProgress> = {
      housing_sos: {
        taskId: "housing_sos",
        status: "done",
        updatedAt: "2026-06-07T00:00:00.000Z",
        completedAt: "2026-06-07T00:00:00.000Z",
      },
    };

    const result = calculateProgress(tasks, progress);

    expect(result.completedCount).toBe(1);
    expect(result.percentage).toBeGreaterThan(0);
    expect(result.urgentRemainingCount).toBe(2);
  });

  it("does not count skipped urgent tasks as urgent remaining", () => {
    const tasks = getPersonalisedTasks(getAllTasks(), arrivedWithoutBsnProfile);
    const progress: Record<string, TaskProgress> = {
      municipality_registration: {
        taskId: "municipality_registration",
        status: "skipped",
        updatedAt: "2026-06-07T00:00:00.000Z",
      },
    };

    expect(calculateProgress(tasks, progress).urgentRemainingCount).toBe(2);
  });
});
