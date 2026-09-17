import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    // Extended custom fields for SETU RBAC
    role: v.optional(
      v.union(
        v.literal("student"),
        v.literal("instituteNodal"),
        v.literal("moTAAdmin")
      )
    ),
    institute: v.optional(v.string()),
    studentId: v.optional(v.string()),
  }),

  schemes: defineTable({
    name: v.string(),
    code: v.string(), // "NFST" | "NOS" | "PreMatric" | "PostMatric"
    type: v.string(),
    totalCorpus: v.number(),
    allocatedYears: v.number(),
    currentYearBudget: v.number(),
    eligibilityRules: v.object({
      category: v.array(v.string()),
      ageMax: v.optional(v.number()),
      academicQualification: v.string(),
      minMarksPercent: v.optional(v.number()),
      incomeCeiling: v.number(),
      programmeType: v.string(),
    }),
    requiredDocs: v.array(v.string()),
    disbursementFrequency: v.string(), // "Quarterly" | "Monthly" | "Annual"
    applicationWindow: v.object({
      startDate: v.string(),
      endDate: v.string(),
    }),
    selectionCriteria: v.string(),
    isActive: v.boolean(),
  }),

  applications: defineTable({
    applicationNumber: v.string(),
    studentId: v.string(),
    userId: v.optional(v.string()),
    studentName: v.string(),
    studentEmail: v.string(),
    studentPhone: v.string(),
    state: v.string(),
    institute: v.string(),
    schemeId: v.string(),
    schemeCode: v.string(),
    status: v.union(
      v.literal("Submitted"),
      v.literal("InitialValidation"),
      v.literal("DocumentScrutiny"),
      v.literal("EligibilityVerification"),
      v.literal("Screening"),
      v.literal("Selection"),
      v.literal("FinalDecision")
    ),
    stageEnteredAt: v.string(),
    stageDwellTimes: v.any(),
    aiScore: v.number(),
    aiScoreReasoning: v.object({
      scoreBreakdown: v.array(
        v.object({
          rule: v.string(),
          weight: v.number(),
          status: v.string(),
          detail: v.string(),
        })
      ),
      summary: v.string(),
    }),
    humanOverride: v.optional(
      v.object({
        overriddenBy: v.string(),
        overriddenAt: v.string(),
        reason: v.string(),
        previousStatus: v.string(),
        newStatus: v.string(),
        previousScore: v.optional(v.number()),
        newScore: v.optional(v.number()),
      })
    ),
    incomeAmount: v.number(),
    marksPercent: v.number(),
    age: v.number(),
    category: v.string(),
    submittedAt: v.string(),
    lastUpdatedAt: v.string(),
  }),

  documents: defineTable({
    applicationId: v.string(),
    type: v.string(),
    fileName: v.string(),
    fileRef: v.string(),
    ocrExtractedFields: v.object({
      extractedName: v.optional(v.string()),
      extractedIncome: v.optional(v.number()),
      extractedMarks: v.optional(v.number()),
      extractedRollNo: v.optional(v.string()),
      extractedCategory: v.optional(v.string()),
      extractedIssueDate: v.optional(v.string()),
      extractedAuthority: v.optional(v.string()),
      rawTextSummary: v.optional(v.string()),
    }),
    verificationStatus: v.union(
      v.literal("Available"),
      v.literal("Missing"),
      v.literal("NeedsReview")
    ),
    deficiencyReason: v.optional(v.string()),
    deficiencyReasonHindi: v.optional(v.string()),
    resubmissionCount: v.number(),
    resubmittedAt: v.optional(v.string()),
  }),

  grievances: defineTable({
    applicationId: v.string(),
    applicationNumber: v.string(),
    studentName: v.string(),
    studentEmail: v.optional(v.string()),
    schemeName: v.string(),
    subject: v.string(),
    description: v.string(),
    raisedAt: v.string(),
    slaDeadline: v.string(),
    status: v.union(
      v.literal("Open"),
      v.literal("InReview"),
      v.literal("Escalated"),
      v.literal("Resolved")
    ),
    escalationLevel: v.number(),
    resolvedAt: v.optional(v.string()),
    resolutionNotes: v.optional(v.string()),
  }),

  disbursements: defineTable({
    schemeId: v.string(),
    applicationId: v.string(),
    studentName: v.string(),
    studentEmail: v.optional(v.string()),
    quarter: v.string(),
    amountReleased: v.number(),
    releasedAt: v.string(),
    status: v.union(
      v.literal("Scheduled"),
      v.literal("Processing"),
      v.literal("Disbursed"),
      v.literal("Flagged")
    ),
    transactionRef: v.string(),
  }),
});
