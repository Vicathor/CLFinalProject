export type StudyLevel = "bachelor" | "master" | "exchange" | "phd" | "other";

export type NationalityGroup = "eu_eea_swiss" | "non_eu_eea_swiss";

export type ArrivalStatus = "planning" | "arrived" | "settling";

export type ResidencyCategory = "eu_eea_swiss" | "non_eu_eea" | "not_sure";

export type HousingStatus =
  | "confirmed"
  | "searching"
  | "temporary_only"
  | "not_started";

export type OnboardingArrivalStatus = "before_arrival" | "already_arrived";

export type BsnStatus = "yes" | "no" | "not_sure";

export type WorkOrPaidInternship = "yes" | "no" | "maybe";

export type InsuranceSituation =
  | "home_country"
  | "private_student"
  | "dutch_basic"
  | "unknown";

export type StudentProfile = {
  id: string;
  displayName?: string;
  studyLevel?: StudyLevel;
  nationalityGroup?: NationalityGroup;
  residencyCategory: ResidencyCategory;
  institutionName?: string;
  city?: string;
  arrivalStatus?: ArrivalStatus;
  onboardingArrivalStatus: OnboardingArrivalStatus;
  arrivalDate?: string;
  housingStatus: HousingStatus;
  bsnStatus: BsnStatus;
  workOrPaidInternship?: WorkOrPaidInternship;
  hasHousing: boolean;
  hasBsn: boolean;
  needsVisaOrResidencePermit?: boolean;
  insuranceSituation?: InsuranceSituation;
  hasDutchBankAccount?: boolean;
  hasDutchPhoneNumber?: boolean;
  createdAt: string;
  updatedAt: string;
};
