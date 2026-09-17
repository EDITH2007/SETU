export type ApplicationStatus =
  | "Submitted"
  | "InitialValidation"
  | "DocumentScrutiny"
  | "EligibilityVerification"
  | "Screening"
  | "Selection"
  | "FinalDecision";

export type SchemeType = "NFST" | "NOS" | "PreMatric" | "PostMatric";

export type VerificationStatus = "Available" | "Missing" | "NeedsReview";

export type UserRole = "student" | "institute" | "moTAAdmin";

export interface EligibilityRules {
  category: string[];
  ageMax?: number;
  academicQualification: string;
  minMarksPercent?: number;
  incomeCeiling: number; // In INR per annum
  programmeType: string;
}

export interface Scheme {
  id: string;
  name: string;
  code: SchemeType;
  type: SchemeType;
  totalCorpus: number; // total budget in INR
  allocatedYears: number; // e.g. 5
  currentYearBudget: number; // annual budget in INR
  eligibilityRules: EligibilityRules;
  requiredDocs: string[];
  disbursementFrequency: "Quarterly" | "Monthly" | "Annual";
  applicationWindow: {
    startDate: string;
    endDate: string;
  };
  selectionCriteria: string;
  isActive: boolean;
}

export interface DocumentItem {
  id: string;
  applicationId: string;
  type: string;
  fileName: string;
  fileRef: string;
  ocrExtractedFields: {
    extractedName?: string;
    extractedIncome?: number;
    extractedMarks?: number;
    extractedRollNo?: string;
    extractedCategory?: string;
    extractedIssueDate?: string;
    extractedAuthority?: string;
    rawTextSummary?: string;
  };
  verificationStatus: VerificationStatus;
  deficiencyReason?: string;
  deficiencyReasonHindi?: string;
  resubmissionCount: number;
  resubmittedAt?: string;
}

export interface ScoreRuleBreakdown {
  rule: string;
  weight: number;
  status: "Passed" | "Failed" | "Warning";
  detail: string;
}

export interface AiScoreReasoning {
  scoreBreakdown: ScoreRuleBreakdown[];
  summary: string;
}

export interface HumanOverride {
  overriddenBy: string;
  overriddenAt: string;
  reason: string;
  previousStatus: string;
  newStatus: string;
  previousScore?: number;
  newScore?: number;
}

export interface Application {
  id: string;
  applicationNumber: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  state: string;
  institute: string;
  schemeId: string;
  schemeCode: SchemeType;
  status: ApplicationStatus;
  stageEnteredAt: string; // ISO date string
  stageDwellTimes: Record<ApplicationStatus, number>; // Days spent in each stage
  documents: DocumentItem[];
  aiScore: number; // 0 to 100
  aiScoreReasoning: AiScoreReasoning;
  humanOverride?: HumanOverride;
  incomeAmount: number;
  marksPercent: number;
  age: number;
  category: string;
  submittedAt: string;
  lastUpdatedAt: string;
}

export interface Grievance {
  id: string;
  applicationId: string;
  applicationNumber: string;
  studentName: string;
  schemeName: string;
  subject: string;
  description: string;
  raisedAt: string;
  slaDeadline: string; // raisedAt + 7 days
  status: "Open" | "InReview" | "Escalated" | "Resolved";
  escalationLevel: 1 | 2 | 3;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface Disbursement {
  id: string;
  schemeId: string;
  applicationId: string;
  studentName: string;
  quarter: string;
  amountReleased: number;
  releasedAt: string;
  status: "Scheduled" | "Processing" | "Disbursed" | "Flagged";
  transactionRef: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  state?: string;
  profile: {
    phone?: string;
    state?: string;
    institution?: string;
  };
}

export interface NotificationItem {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  type: "status_change" | "deficiency" | "grievance" | "disbursement";
  timestamp: string;
  read: boolean;
  simulatedDelivery?: {
    emailSent: boolean;
    smsSent: boolean;
    smsText?: string;
  };
}
