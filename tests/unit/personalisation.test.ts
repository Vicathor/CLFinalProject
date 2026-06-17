import { describe, expect, it } from "vitest";

import { getAllTasks } from "@/lib/content";
import {
  getPersonalisedTasks,
  getTopNextActions,
} from "@/lib/personalisation";
import type { TaskId } from "@/types/content";
import type {
  BsnStatus,
  HousingStatus,
  OnboardingArrivalStatus,
  ResidencyCategory,
  StudentProfile,
} from "@/types/profile";

function createProfile(overrides: {
  residencyCategory: ResidencyCategory;
  housingStatus: HousingStatus;
  onboardingArrivalStatus: OnboardingArrivalStatus;
  bsnStatus: BsnStatus;
}): StudentProfile {
  return {
    id: "test-profile",
    ...overrides,
    hasHousing: overrides.housingStatus === "confirmed",
    hasBsn: overrides.bsnStatus === "yes",
    createdAt: "2026-06-07T00:00:00.000Z",
    updatedAt: "2026-06-07T00:00:00.000Z",
  };
}

function byId(tasks: ReturnType<typeof getPersonalisedTasks>, taskId: TaskId) {
  const task = tasks.find((item) => item.id === taskId);

  if (!task) {
    throw new Error(`Missing task ${taskId}`);
  }

  return task;
}

describe("personalisation", () => {
  it("prioritises non-EU users with no housing before arrival", () => {
    const profile = createProfile({
      residencyCategory: "non_eu_eea",
      housingStatus: "searching",
      onboardingArrivalStatus: "before_arrival",
      bsnStatus: "no",
    });
    const tasks = getPersonalisedTasks(getAllTasks(), profile);
    const topActions = getTopNextActions(tasks, {}, 3).map((task) => task.id);

    expect(byId(tasks, "housing_sos").urgency).toBe("urgent");
    expect(byId(tasks, "visa_residence_permit")).toMatchObject({
      urgency: "important",
      applicability: "applicable",
    });
    expect(byId(tasks, "health_insurance").urgency).toBe("normal");
    expect(topActions).toContain("housing_sos");
  });

  it("keeps EU users with housing before arrival on lower-priority general tasks", () => {
    const profile = createProfile({
      residencyCategory: "eu_eea_swiss",
      housingStatus: "confirmed",
      onboardingArrivalStatus: "before_arrival",
      bsnStatus: "no",
    });
    const tasks = getPersonalisedTasks(getAllTasks(), profile);

    expect(byId(tasks, "housing_sos")).toMatchObject({
      urgency: "later",
      applicability: "not_applicable",
    });
    expect(byId(tasks, "visa_residence_permit")).toMatchObject({
      urgency: "later",
      applicability: "not_applicable",
    });
    expect(byId(tasks, "health_insurance").urgency).toBe("normal");
    const topActions = getTopNextActions(tasks, {}, 3).map((task) => task.id);
    expect(topActions).not.toContain("housing_sos");
    expect(topActions).not.toContain("visa_residence_permit");
  });

  it("makes municipality registration and BSN urgent after arrival without BSN", () => {
    const profile = createProfile({
      residencyCategory: "eu_eea_swiss",
      housingStatus: "temporary_only",
      onboardingArrivalStatus: "already_arrived",
      bsnStatus: "no",
    });
    const tasks = getPersonalisedTasks(getAllTasks(), profile);
    const topActions = getTopNextActions(tasks, {}, 3).map((task) => task.id);

    expect(byId(tasks, "housing_sos").urgency).toBe("urgent");
    expect(byId(tasks, "municipality_registration").urgency).toBe("urgent");
    expect(byId(tasks, "bsn").urgency).toBe("urgent");
    expect(topActions).toEqual(
      expect.arrayContaining([
        "housing_sos",
        "municipality_registration",
        "bsn",
      ]),
    );
  });

  it("marks visa as maybe applicable when residency category is not sure", () => {
    const profile = createProfile({
      residencyCategory: "not_sure",
      housingStatus: "confirmed",
      onboardingArrivalStatus: "before_arrival",
      bsnStatus: "not_sure",
    });
    const tasks = getPersonalisedTasks(getAllTasks(), profile);

    expect(byId(tasks, "visa_residence_permit")).toMatchObject({
      urgency: "important",
      applicability: "maybe_applicable",
    });
  });

  it("marks tasks not applicable for an EU user who has arrived with housing and a BSN", () => {
    const profile = createProfile({
      residencyCategory: "eu_eea_swiss",
      housingStatus: "confirmed",
      onboardingArrivalStatus: "already_arrived",
      bsnStatus: "yes",
    });
    const tasks = getPersonalisedTasks(getAllTasks(), profile);

    expect(byId(tasks, "bsn").applicability).toBe("not_applicable");
    expect(byId(tasks, "housing_sos").applicability).toBe("not_applicable");
    expect(byId(tasks, "visa_residence_permit").applicability).toBe(
      "not_applicable",
    );
    expect(byId(tasks, "plan_arrival").applicability).toBe("not_applicable");
    expect(byId(tasks, "municipality_registration").applicability).toBe(
      "not_applicable",
    );

    const topActions = getTopNextActions(tasks, {}, 5).map((task) => task.id);
    expect(topActions).not.toContain("bsn");
    expect(topActions).not.toContain("housing_sos");
    expect(topActions).not.toContain("visa_residence_permit");
    expect(topActions).not.toContain("plan_arrival");
    expect(topActions).not.toContain("municipality_registration");
  });

  it("produces different top next actions for different profiles", () => {
    const firstProfile = createProfile({
      residencyCategory: "non_eu_eea",
      housingStatus: "searching",
      onboardingArrivalStatus: "before_arrival",
      bsnStatus: "no",
    });
    const secondProfile = createProfile({
      residencyCategory: "eu_eea_swiss",
      housingStatus: "confirmed",
      onboardingArrivalStatus: "before_arrival",
      bsnStatus: "no",
    });

    const firstTopActions = getTopNextActions(
      getPersonalisedTasks(getAllTasks(), firstProfile),
      {},
      3,
    ).map((task) => task.id);
    const secondTopActions = getTopNextActions(
      getPersonalisedTasks(getAllTasks(), secondProfile),
      {},
      3,
    ).map((task) => task.id);

    expect(firstTopActions).not.toEqual(secondTopActions);
  });
});
