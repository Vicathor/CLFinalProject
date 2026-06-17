import { describe, expect, it } from "vitest";

import askContacts from "@/data/ask-contacts.json";
import faqs from "@/data/faqs.json";
import officialSources from "@/data/official-sources.json";
import studentTips from "@/data/student-tips.json";
import tasks from "@/data/tasks.json";
import topics from "@/data/topics.json";
import type {
  AskContact,
  FaqItem,
  OfficialSource,
  StudentTip,
  Task,
  TaskId,
  Topic,
  TopicId,
} from "@/types/content";

const expectedTaskIds = [
  "housing_sos",
  "visa_residence_permit",
  "prepare_documents",
  "plan_arrival",
  "municipality_registration",
  "bsn",
  "money_bank_account",
  "dutch_phone_number",
  "health_insurance",
  "gp_registration",
  "digid",
  "transport_bike_daily_life",
] as const satisfies readonly TaskId[];

const expectedTopicIds = [
  "housing",
  "visa_residence",
  "documents",
  "municipality_bsn_digid",
  "money_banking",
  "healthcare_gp",
  "phone_sim",
  "transport_daily_life",
  "university_life",
  "daily_life",
] as const satisfies readonly TopicId[];

const typedTasks = tasks as Task[];
const typedTopics = topics as Topic[];
const typedOfficialSources = officialSources as OfficialSource[];
const typedStudentTips = studentTips as StudentTip[];
const typedAskContacts = askContacts as AskContact[];
const typedFaqs = faqs as FaqItem[];

function findDuplicateIds(items: readonly { id: string }[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const item of items) {
    if (seen.has(item.id)) {
      duplicates.add(item.id);
    }

    seen.add(item.id);
  }

  return [...duplicates];
}

function expectUniqueIds(label: string, items: readonly { id: string }[]) {
  expect(findDuplicateIds(items), `${label} IDs should be unique`).toEqual([]);
}

function expectEveryReferenceExists(
  label: string,
  referencedIds: readonly string[],
  validIds: ReadonlySet<string>,
) {
  const missingIds = referencedIds.filter((id) => !validIds.has(id));
  expect(missingIds, `${label} has missing referenced IDs`).toEqual([]);
}

describe("content integrity", () => {
  it("has the expected unique task and topic IDs", () => {
    expectUniqueIds("Task", typedTasks);
    expectUniqueIds("Topic", typedTopics);

    expect(typedTasks.map((task) => task.id).sort()).toEqual(
      [...expectedTaskIds].sort(),
    );
    expect(typedTopics.map((topic) => topic.id).sort()).toEqual(
      [...expectedTopicIds].sort(),
    );
  });

  it("has unique supporting content IDs", () => {
    expectUniqueIds("Official source", typedOfficialSources);
    expectUniqueIds("Student tip", typedStudentTips);
    expectUniqueIds("Ask contact", typedAskContacts);
    expectUniqueIds("FAQ", typedFaqs);
  });

  it("has complete required task support references", () => {
    for (const task of typedTasks) {
      expect(
        task.officialSourceIds.length,
        `${task.id} should have at least one official source`,
      ).toBeGreaterThan(0);
      expect(
        task.studentTipIds.length,
        `${task.id} should have at least one student tip`,
      ).toBeGreaterThan(0);
      expect(
        task.askContactIds.length,
        `${task.id} should have at least one ask contact`,
      ).toBeGreaterThan(0);
    }
  });

  it("has required official source metadata", () => {
    for (const source of typedOfficialSources) {
      expect(source.title, `${source.id} should have a title`).toBeTruthy();
      expect(source.url, `${source.id} should have a URL`).toMatch(/^https:\/\//);
      expect(source.lastChecked, `${source.id} should have lastChecked`).toMatch(
        /^\d{4}-\d{2}-\d{2}$/,
      );
    }
  });

  it("only references IDs that exist", () => {
    const taskIds = new Set(typedTasks.map((task) => task.id));
    const topicIds = new Set(typedTopics.map((topic) => topic.id));
    const sourceIds = new Set(typedOfficialSources.map((source) => source.id));
    const tipIds = new Set(typedStudentTips.map((tip) => tip.id));
    const contactIds = new Set(typedAskContacts.map((contact) => contact.id));
    const faqIds = new Set(typedFaqs.map((faq) => faq.id));

    for (const task of typedTasks) {
      expectEveryReferenceExists(
        `${task.id}.officialSourceIds`,
        task.officialSourceIds,
        sourceIds,
      );
      expectEveryReferenceExists(
        `${task.id}.studentTipIds`,
        task.studentTipIds,
        tipIds,
      );
      expectEveryReferenceExists(
        `${task.id}.askContactIds`,
        task.askContactIds,
        contactIds,
      );
      expectEveryReferenceExists(
        `${task.id}.relatedTaskIds`,
        task.relatedTaskIds,
        taskIds,
      );
      expectEveryReferenceExists(
        `${task.id}.relatedTopicIds`,
        task.relatedTopicIds,
        topicIds,
      );
      expectEveryReferenceExists(`${task.id}.faqIds`, task.faqIds, faqIds);
    }

    for (const topic of typedTopics) {
      expectEveryReferenceExists(
        `${topic.id}.relatedTaskIds`,
        topic.relatedTaskIds,
        taskIds,
      );
      expectEveryReferenceExists(
        `${topic.id}.officialSourceIds`,
        topic.officialSourceIds,
        sourceIds,
      );
      expectEveryReferenceExists(
        `${topic.id}.studentTipIds`,
        topic.studentTipIds,
        tipIds,
      );
      expectEveryReferenceExists(
        `${topic.id}.askContactIds`,
        topic.askContactIds,
        contactIds,
      );
      expectEveryReferenceExists(`${topic.id}.faqIds`, topic.faqIds, faqIds);
    }

    for (const faq of typedFaqs) {
      expectEveryReferenceExists(`${faq.id}.relatedTaskIds`, faq.relatedTaskIds, taskIds);
      expectEveryReferenceExists(
        `${faq.id}.relatedTopicIds`,
        faq.relatedTopicIds,
        topicIds,
      );
    }
  });
});
