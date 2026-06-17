import type { NationalityGroup, StudentProfile } from "@/types/profile";

export type TaskCategory =
  | "housing"
  | "immigration"
  | "documents"
  | "arrival"
  | "registration"
  | "money"
  | "phone"
  | "healthcare"
  | "digital_identity"
  | "transport";

export type TaskPhase = "before_arrival" | "arrival_week" | "first_month";

export type TopicId =
  | "housing"
  | "visa_residence"
  | "documents"
  | "municipality_bsn_digid"
  | "money_banking"
  | "healthcare_gp"
  | "transport_daily_life"
  | "daily_life"
  | "university_life"
  | "phone_sim";

export type TaskId =
  | "housing_sos"
  | "visa_residence_permit"
  | "prepare_documents"
  | "plan_arrival"
  | "municipality_registration"
  | "bsn"
  | "money_bank_account"
  | "dutch_phone_number"
  | "health_insurance"
  | "gp_registration"
  | "digid"
  | "transport_bike_daily_life";

export type PersonalisationCondition = {
  field: keyof StudentProfile;
  equals?: string | boolean;
  includes?: string;
};

export type PersonalisationRule = {
  id: string;
  label: string;
  conditions: PersonalisationCondition[];
  priorityAdjustment: number;
  reason: string;
};

export type Task = {
  id: TaskId;
  title: string;
  category: TaskCategory;
  phase: TaskPhase;
  basePriority: number;
  summary: string;
  appliesToLabel: string;
  whatThisIs: string;
  whyItMatters: string;
  nextSteps: string[];
  officialSourceIds: string[];
  studentTipIds: string[];
  askContactIds: string[];
  relatedTaskIds: TaskId[];
  relatedTopicIds: TopicId[];
  faqIds: string[];
  tags: string[];
  rules?: PersonalisationRule[];
};

export type Topic = {
  id: TopicId;
  title: string;
  summary: string;
  body: string;
  relatedTaskIds: TaskId[];
  officialSourceIds: string[];
  studentTipIds: string[];
  askContactIds: string[];
  faqIds: string[];
  tags: string[];
};

export type OfficialSource = {
  id: string;
  title: string;
  url: string;
  lastChecked: string;
};

export type StudentTip = {
  id: string;
  title: string;
  body: string;
  tags: string[];
};

export type AskContact = {
  id: string;
  title: string;
  description: string;
  contactUrl: string;
  tags: string[];
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  relatedTaskIds: TaskId[];
  relatedTopicIds: TopicId[];
  tags: string[];
};

export type ContentMeta = {
  version: string;
  locale: string;
  title: string;
  description: string;
  lastUpdated: string;
  sourceReviewDate: string;
};

export type AudienceRule = {
  nationalityGroup?: NationalityGroup;
  appliesToTaskIds: TaskId[];
  label: string;
};
