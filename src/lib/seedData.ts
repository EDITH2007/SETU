import { Scheme, Application, Grievance, Disbursement, UserProfile } from "@/types";
import { calculateDeterministicEligibilityScore } from "./scoring";

export const INITIAL_SCHEMES: Scheme[] = [
  {
    id: "scheme-nfst",
    name: "National Fellowship for Higher Education of ST Students (NFST)",
    code: "NFST",
    type: "NFST",
    totalCorpus: 450000000, // ₹45 Crore
    allocatedYears: 5,
    currentYearBudget: 90000000, // ₹9 Crore / yr
    eligibilityRules: {
      category: ["ST"],
      academicQualification: "Post Graduate Degree (M.Sc/M.A/M.Tech/M.Phil) with min 55%",
      minMarksPercent: 55,
      incomeCeiling: 600000, // ₹6.0 LPA
      programmeType: "M.Phil / Ph.D. Regular Full-Time",
    },
    requiredDocs: [
      "ST Category Certificate",
      "Annual Income Certificate",
      "Post Graduate Marksheet & Degree",
      "Ph.D./M.Phil University Admission Letter",
      "Aadhaar Card",
    ],
    disbursementFrequency: "Quarterly",
    applicationWindow: {
      startDate: "2026-01-01",
      endDate: "2026-10-31",
    },
    selectionCriteria: "Deterministic Merit Score based on PG Marks + Income Tier + Verification",
    isActive: true,
  },
  {
    id: "scheme-nos",
    name: "National Overseas Scholarship for ST Students (NOS)",
    code: "NOS",
    type: "NOS",
    totalCorpus: 300000000, // ₹30 Crore
    allocatedYears: 4,
    currentYearBudget: 75000000, // ₹7.5 Crore / yr
    eligibilityRules: {
      category: ["ST"],
      ageMax: 35,
      academicQualification: "Bachelor's / Master's with min 55% marks",
      minMarksPercent: 55,
      incomeCeiling: 600000, // ₹6.0 LPA
      programmeType: "Master's / Ph.D. in Top 500 QS World Universities",
    },
    requiredDocs: [
      "ST Category Certificate",
      "Annual Income Certificate",
      "Qualifying Degree Marksheet",
      "Unconditional Offer Letter from Foreign University",
      "Valid Indian Passport",
      "GRE / TOEFL / IELTS Scorecard",
    ],
    disbursementFrequency: "Quarterly",
    applicationWindow: {
      startDate: "2026-02-15",
      endDate: "2026-11-30",
    },
    selectionCriteria: "Strict Verification of QS World University Ranking + Income & Academic Merit",
    isActive: true,
  },
  {
    id: "scheme-prematric",
    name: "Pre-Matric Scholarship for ST Students (Class IX & X)",
    code: "PreMatric",
    type: "PreMatric",
    totalCorpus: 800000000, // ₹80 Crore
    allocatedYears: 3,
    currentYearBudget: 266000000, // ₹26.6 Crore / yr
    eligibilityRules: {
      category: ["ST"],
      academicQualification: "Enrolled in Class IX or X in Govt/Recognized School",
      minMarksPercent: 40,
      incomeCeiling: 250000, // ₹2.5 LPA
      programmeType: "Class IX & X Schooling",
    },
    requiredDocs: [
      "ST Category Certificate",
      "Annual Income Certificate",
      "Previous Class Marksheet",
      "Aadhaar Linked Bank Passbook",
    ],
    disbursementFrequency: "Annual",
    applicationWindow: {
      startDate: "2026-04-01",
      endDate: "2026-12-31",
    },
    selectionCriteria: "Direct Income Eligibility Verification & School Enrollment Check",
    isActive: true,
  },
  {
    id: "scheme-postmatric",
    name: "Post-Matric Scholarship for ST Students",
    code: "PostMatric",
    type: "PostMatric",
    totalCorpus: 1200000000, // ₹120 Crore
    allocatedYears: 5,
    currentYearBudget: 240000000, // ₹24 Crore / yr
    eligibilityRules: {
      category: ["ST"],
      academicQualification: "Class XI to Post Graduate Studies",
      minMarksPercent: 45,
      incomeCeiling: 250000, // ₹2.5 LPA
      programmeType: "Post-Secondary Higher Education",
    },
    requiredDocs: [
      "ST Category Certificate",
      "Annual Income Certificate",
      "Previous Exam Marksheet",
      "Current Year Fee Receipt",
      "Aadhaar Card & Bank Details",
    ],
    disbursementFrequency: "Quarterly",
    applicationWindow: {
      startDate: "2026-03-01",
      endDate: "2026-12-15",
    },
    selectionCriteria: "State-wise Quota & Direct Statutory Income Check",
    isActive: true,
  },
];

// Helper to generate 40 realistic demo applications
export function generateSeedApplications(): Application[] {
  const states = [
    "Odisha",
    "Jharkhand",
    "Chhattisgarh",
    "Madhya Pradesh",
    "Assam",
    "Rajasthan",
    "Maharashtra",
    "Telangana",
    "Gujarat",
    "Meghalaya",
  ];

  const firstNames = [
    "Birsa",
    "Savitri",
    "Sidhu",
    "Kanhu",
    "Droupadi",
    "Rani",
    "Tilya",
    "Jaipal",
    "Sunder",
    "Lako",
    "Phulo",
    "Jhana",
    "Tana",
    "Ganga",
    "Rudra",
    "Anandi",
    "Shanti",
    "Kalyan",
    "Mangal",
    "Devi",
    "Bikram",
    "Subhadra",
    "Basanti",
    "Lakshman",
    "Champa",
    "Somra",
    "Buda",
    "Moti",
    "Prem",
    "Arjun",
    "Geeta",
    "Nirmala",
    "Kiran",
    "Ashok",
    "Manohar",
    "Anita",
    "Deepak",
    "Rekha",
    "Vijay",
    "Pooja",
  ];

  const lastNames = [
    "Munda",
    "Soren",
    "Tudu",
    "Hembrom",
    "Kora",
    "Oraon",
    "Marandi",
    "Besra",
    "Kisku",
    "Hansda",
    "Gond",
    "Bhil",
    "Santhal",
    "Bodo",
    "Khasi",
    "Garo",
    "Rathwa",
    "Vasava",
    "Nayak",
    "Meena",
  ];

  const institutes = [
    "IIT Kharagpur",
    "NIT Rourkela",
    "Utkal University, Bhubaneswar",
    "Ranchi University, Jharkhand",
    "Bastar University, Jagdalpur",
    "Gauhati University, Assam",
    "Jawaharlal Nehru University, New Delhi",
    "University of Oxford (UK)",
    "Imperial College London (UK)",
    "Univ of Melbourne (Australia)",
    "Govt High School, Mayurbhanj",
    "Eklavya Model Residential School, Ranchi",
    "Govt Degree College, Bastar",
    "Presidency University, Kolkata",
  ];

  const statuses: Application["status"][] = [
    "Submitted",
    "InitialValidation",
    "DocumentScrutiny",
    "EligibilityVerification",
    "Screening",
    "Selection",
    "FinalDecision",
  ];

  const result: Application[] = [];

  for (let i = 1; i <= 40; i++) {
    const fn = firstNames[(i - 1) % firstNames.length];
    const ln = lastNames[(i - 1) % lastNames.length];
    const studentName = `${fn} ${ln}`;
    const state = states[(i - 1) % states.length];
    const inst = institutes[(i - 1) % institutes.length];

    // Pick scheme code
    let schemeCode: Scheme["code"] = "NFST";
    if (i % 4 === 0) schemeCode = "NOS";
    else if (i % 4 === 1) schemeCode = "PreMatric";
    else if (i % 4 === 2) schemeCode = "PostMatric";

    const targetScheme = INITIAL_SCHEMES.find((s) => s.code === schemeCode) || INITIAL_SCHEMES[0];

    // Varied metrics
    const incomeAmount = 80000 + ((i * 13000) % 450000); // Between ₹80,000 and ₹5,30,000
    const marksPercent = 52 + ((i * 7) % 43); // 52% to 95%
    const age = 15 + ((i * 3) % 20); // 15 to 35
    const category = "ST";

    // Select status with intentional bottlenecks
    let status: Application["status"] = statuses[(i - 1) % statuses.length];

    // Create intentional bottleneck for DocumentScrutiny in Odisha & Jharkhand
    let docScrutinyDwell = 3 + (i % 4);
    if ((state === "Odisha" || state === "Jharkhand" || state === "Assam") && (i % 3 === 0)) {
      status = "DocumentScrutiny";
      docScrutinyDwell = 14 + (i % 12); // 14 to 25 days delayed!
    }

    const dwellTimes: Record<Application["status"], number> = {
      Submitted: 1 + (i % 2),
      InitialValidation: 2 + (i % 3),
      DocumentScrutiny: docScrutinyDwell,
      EligibilityVerification: 3 + (i % 5),
      Screening: 2 + (i % 4),
      Selection: 2 + (i % 3),
      FinalDecision: 1 + (i % 2),
    };

    // Intentionally add deficiency to some apps in DocumentScrutiny or EligibilityVerification
    const hasDeficiency = status === "DocumentScrutiny" && i % 2 === 1;

    const documents = targetScheme.requiredDocs.map((docType, dIdx) => {
      const isThisDeficient = hasDeficiency && dIdx === 1; // e.g. Income cert or Caste cert
      return {
        id: `doc-${i}-${dIdx}`,
        applicationId: `app-${i}`,
        type: docType,
        fileName: isThisDeficient ? `${docType.replace(/\s+/g, "_")}_DEFICIENT.pdf` : `${docType.replace(/\s+/g, "_")}_VERIFIED.pdf`,
        fileRef: "/mock_docs/sample.pdf",
        ocrExtractedFields: {
          extractedName: studentName,
          extractedIncome: isThisDeficient ? incomeAmount + 200000 : incomeAmount,
          extractedMarks: marksPercent,
          extractedRollNo: `STU-2025-${8000 + i}`,
          extractedCategory: "ST",
          extractedIssueDate: isThisDeficient ? "2021-02-10 (EXPIRED)" : "2024-06-15",
          extractedAuthority: "Tehsildar & Sub-Collector",
          rawTextSummary: isThisDeficient
            ? "OCR warning: Income certificate issue date is older than 3 years."
            : "OCR verified: Valid digital signature and official stamp found.",
        },
        verificationStatus: isThisDeficient ? ("NeedsReview" as const) : ("Available" as const),
        deficiencyReason: isThisDeficient
          ? "Income Certificate Expired — Submitted certificate date (2021) exceeds the 3-year statutory validity period. Please re-upload current FY income certificate."
          : undefined,
        deficiencyReasonHindi: isThisDeficient
          ? "आय प्रमाण पत्र समाप्त — जमा किया गया आय प्रमाण पत्र (2021) 3 वर्ष की वैधानिक वैधता अवधि पार कर चुका है। कृपया वर्तमान वित्तीय वर्ष का प्रमाण पत्र अपलोड करें।"
          : undefined,
        resubmissionCount: isThisDeficient ? 1 : 0,
      };
    });

    const { aiScore, reasoning } = calculateDeterministicEligibilityScore(
      targetScheme,
      incomeAmount,
      marksPercent,
      age,
      category,
      documents
    );

    // Add human override to 2 apps
    let humanOverride: Application["humanOverride"] = undefined;
    if (i === 7) {
      humanOverride = {
        overriddenBy: "Dr. Ramesh Verma (MoTA Joint Secretary)",
        overriddenAt: "2026-08-20T10:30:00Z",
        reason: "Special relaxation granted under MoTA Board Resolution #402 for tribal student from remote Aspirational District.",
        previousStatus: "DocumentScrutiny",
        newStatus: "EligibilityVerification",
        previousScore: 45,
        newScore: 85,
      };
    } else if (i === 15) {
      humanOverride = {
        overriddenBy: "Shri S. K. Hansda (State Nodal Officer)",
        overriddenAt: "2026-09-02T14:15:00Z",
        reason: "Verified original physical copy of Caste Certificate at State Office; digital QR scan bypass approved.",
        previousStatus: "DocumentScrutiny",
        newStatus: "Screening",
        previousScore: 60,
        newScore: 90,
      };
    }

    result.push({
      id: `app-${i}`,
      applicationNumber: `SETU-2026-${schemeCode}-${String(1000 + i)}`,
      studentId: `std-${i}`,
      studentName,
      studentEmail: `${fn.toLowerCase()}.${ln.toLowerCase()}@example.gov.in`,
      studentPhone: `+91 98${String(10000000 + i * 3421).slice(0, 8)}`,
      state,
      institute: inst,
      schemeId: targetScheme.id,
      schemeCode,
      status,
      stageEnteredAt: new Date(Date.now() - (dwellTimes[status] * 86400000 + i * 3600000)).toISOString(),
      stageDwellTimes: dwellTimes,
      documents,
      aiScore,
      aiScoreReasoning: reasoning,
      humanOverride,
      incomeAmount,
      marksPercent,
      age,
      category,
      submittedAt: new Date(Date.now() - (45 - i) * 86400000).toISOString(),
      lastUpdatedAt: new Date(Date.now() - i * 3600000).toISOString(),
    });
  }

  return result;
}

export const INITIAL_GRIEVANCES: Grievance[] = [
  {
    id: "grv-1",
    applicationId: "app-3",
    applicationNumber: "SETU-2026-PreMatric-1003",
    studentName: "Sidhu Hembrom",
    schemeName: "Pre-Matric Scholarship for ST Students",
    subject: "Application stuck in Document Scrutiny for 18 days",
    description: "My application has been pending at the State Nodal Verification office in Odisha without any deficiency notice. Request urgent clearance.",
    raisedAt: new Date(Date.now() - 11 * 86400000).toISOString(), // 11 days ago (BREACHED SLA!)
    slaDeadline: new Date(Date.now() - 4 * 86400000).toISOString(), // Deadline was 4 days ago
    status: "Escalated",
    escalationLevel: 3, // Level 3: MoTA Joint Secretary Escalation
  },
  {
    id: "grv-2",
    applicationId: "app-9",
    applicationNumber: "SETU-2026-NFST-1009",
    studentName: "Droupadi Besra",
    schemeName: "National Fellowship for Higher Education of ST Students (NFST)",
    subject: "Delay in Document Verification for Ph.D. Admission Letter",
    description: "Uploaded university admission letter from Utkal University 14 days ago. Still shown under scrutiny.",
    raisedAt: new Date(Date.now() - 8 * 86400000).toISOString(), // 8 days ago (BREACHED SLA!)
    slaDeadline: new Date(Date.now() - 1 * 86400000).toISOString(), // Deadline was 1 day ago
    status: "Escalated",
    escalationLevel: 2, // Level 2: State Director Escalation
  },
  {
    id: "grv-3",
    applicationId: "app-18",
    applicationNumber: "SETU-2026-NOS-1018",
    studentName: "Jaipal Rathwa",
    schemeName: "National Overseas Scholarship for ST Students (NOS)",
    subject: "Clarification on QS Ranking Eligibility for Foreign Univ",
    description: "My foreign university offer letter is from University of Melbourne (Rank #14). Request verification status update.",
    raisedAt: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
    slaDeadline: new Date(Date.now() + 5 * 86400000).toISOString(), // Deadline in 5 days
    status: "Open",
    escalationLevel: 1, // Level 1: Nodal Officer
  },
  {
    id: "grv-4",
    applicationId: "app-24",
    applicationNumber: "SETU-2026-PostMatric-1024",
    studentName: "Phulo Gond",
    schemeName: "Post-Matric Scholarship for ST Students",
    subject: "Bank account Aadhaar seeding verification status",
    description: "Re-submitted bank passbook with Aadhaar linkage confirmation.",
    raisedAt: new Date(Date.now() - 5 * 86400000).toISOString(), // 5 days ago
    slaDeadline: new Date(Date.now() + 2 * 86400000).toISOString(), // Deadline in 2 days
    status: "InReview",
    escalationLevel: 1,
  },
];

export const INITIAL_DISBURSEMENTS: Disbursement[] = [
  {
    id: "disb-1",
    schemeId: "scheme-nfst",
    applicationId: "app-4",
    studentName: "Kanhu Tudu",
    quarter: "Q1 FY26 (Apr-Jun)",
    amountReleased: 93000, // ₹31,000 x 3 months fellowship
    releasedAt: "2026-05-10",
    status: "Disbursed",
    transactionRef: "PFMS/2026/NFST/849201",
  },
  {
    id: "disb-2",
    schemeId: "scheme-nfst",
    applicationId: "app-8",
    studentName: "Jaipal Marandi",
    quarter: "Q1 FY26 (Apr-Jun)",
    amountReleased: 93000,
    releasedAt: "2026-05-12",
    status: "Disbursed",
    transactionRef: "PFMS/2026/NFST/849202",
  },
  {
    id: "disb-3",
    schemeId: "scheme-nfst",
    applicationId: "app-12",
    studentName: "Lako Kisku",
    quarter: "Q2 FY26 (Jul-Sep)",
    amountReleased: 93000,
    releasedAt: "2026-08-15",
    status: "Disbursed",
    transactionRef: "PFMS/2026/NFST/849310",
  },
  {
    id: "disb-4",
    schemeId: "scheme-nos",
    applicationId: "app-16",
    studentName: "Tana Hansda",
    quarter: "Q1 FY26 Overseas Stipend",
    amountReleased: 450000, // ₹4.5 Lakh overseas tuition & stipend installment
    releasedAt: "2026-06-01",
    status: "Disbursed",
    transactionRef: "RBI/DBT/NOS/992101",
  },
  {
    id: "disb-5",
    schemeId: "scheme-nos",
    applicationId: "app-20",
    studentName: "Ganga Bodo",
    quarter: "Q2 FY26 Overseas Stipend",
    amountReleased: 450000,
    releasedAt: "2026-08-20",
    status: "Disbursed",
    transactionRef: "RBI/DBT/NOS/992102",
  },
  {
    id: "disb-6",
    schemeId: "scheme-prematric",
    applicationId: "app-28",
    studentName: "Mangal Rathwa",
    quarter: "Annual FY26 Grant",
    amountReleased: 4000,
    releasedAt: "2026-07-10",
    status: "Disbursed",
    transactionRef: "PFMS/2026/PRE/30291",
  },
];
