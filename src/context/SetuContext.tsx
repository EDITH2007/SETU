"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Scheme,
  Application,
  Grievance,
  Disbursement,
  UserRole,
  NotificationItem,
  DocumentItem,
  ApplicationStatus,
} from "@/types";
import { INITIAL_SCHEMES, generateSeedApplications, INITIAL_GRIEVANCES, INITIAL_DISBURSEMENTS } from "@/lib/seedData";
import { calculateDeterministicEligibilityScore } from "@/lib/scoring";
import { extractDocumentDataPuter, generateHindiDeficiencyPuter } from "@/lib/puterAi";

interface SetuContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  schemes: Scheme[];
  applications: Application[];
  grievances: Grievance[];
  disbursements: Disbursement[];
  notifications: NotificationItem[];
  selectedAppId: string | null;
  setSelectedAppId: (id: string | null) => void;
  
  // Actions
  addScheme: (scheme: Omit<Scheme, "id">) => void;
  updateScheme: (id: string, scheme: Partial<Scheme>) => void;
  createApplication: (appData: {
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    state: string;
    institute: string;
    schemeCode: Scheme["code"];
    incomeAmount: number;
    marksPercent: number;
    age: number;
    category: string;
    uploadedDocs: Array<{ type: string; fileName: string; fileRef: string }>;
  }) => Promise<string>;
  updateApplicationStatus: (appId: string, status: ApplicationStatus) => void;
  applyHumanOverride: (
    appId: string,
    overrideData: { overriddenBy: string; reason: string; newStatus: ApplicationStatus; newScore?: number }
  ) => void;
  resubmitDocument: (appId: string, docId: string, fileName: string) => Promise<void>;
  retryAiCheck: (appId: string, docId: string) => Promise<void>;
  raiseGrievance: (appId: string, subject: string, description: string) => void;
  resolveGrievance: (grievanceId: string, notes: string) => void;
  releaseDisbursement: (schemeId: string, appId: string, studentName: string, quarter: string, amount: number) => void;
  resetToSeedData: () => void;
  markNotificationRead: (id: string) => void;
}

const SetuContext = createContext<SetuContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "setu_platform_state_v1";

export const SetuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>("student");
  const [schemes, setSchemes] = useState<Scheme[]>(INITIAL_SCHEMES);
  const [applications, setApplications] = useState<Application[]>([]);
  const [grievances, setGrievances] = useState<Grievance[]>(INITIAL_GRIEVANCES);
  const [disbursements, setDisbursements] = useState<Disbursement[]>(INITIAL_DISBURSEMENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from LocalStorage or seed data
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSchemes(parsed.schemes || INITIAL_SCHEMES);
        setApplications(parsed.applications || generateSeedApplications());
        setGrievances(parsed.grievances || INITIAL_GRIEVANCES);
        setDisbursements(parsed.disbursements || INITIAL_DISBURSEMENTS);
        setNotifications(parsed.notifications || []);
      } else {
        const seedApps = generateSeedApplications();
        setApplications(seedApps);
        setSchemes(INITIAL_SCHEMES);
        setGrievances(INITIAL_GRIEVANCES);
        setDisbursements(INITIAL_DISBURSEMENTS);
      }
    } catch (e) {
      console.warn("Failed to read state from local storage:", e);
      setApplications(generateSeedApplications());
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Persist state changes
  useEffect(() => {
    if (!isInitialized || typeof window === "undefined") return;

    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          schemes,
          applications,
          grievances,
          disbursements,
          notifications,
        })
      );
    } catch (e) {
      console.error("Failed to save state to local storage:", e);
    }
  }, [schemes, applications, grievances, disbursements, notifications, isInitialized]);

  // Periodic SLA Check for Grievance Escalation
  useEffect(() => {
    const interval = setInterval(() => {
      setGrievances((prev) =>
        prev.map((g) => {
          if (g.status === "Resolved") return g;
          const deadline = new Date(g.slaDeadline).getTime();
          const now = Date.now();

          if (now > deadline) {
            // Breached SLA - auto escalate up to level 3
            const nextLevel = Math.min(3, g.escalationLevel + 1) as 1 | 2 | 3;
            if (nextLevel !== g.escalationLevel || g.status !== "Escalated") {
              return {
                ...g,
                status: "Escalated",
                escalationLevel: nextLevel,
              };
            }
          }
          return g;
        })
      );
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, []);

  // Helper notification push
  const addNotification = (
    recipientId: string,
    title: string,
    message: string,
    type: NotificationItem["type"],
    smsText?: string
  ) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      recipientId,
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false,
      simulatedDelivery: {
        emailSent: true,
        smsSent: true,
        smsText: smsText || `[MoTA SETU Alert]: ${title} - ${message}`,
      },
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Actions
  const addScheme = (schemeData: Omit<Scheme, "id">) => {
    const newScheme: Scheme = {
      ...schemeData,
      id: `scheme-${Date.now()}`,
    };
    setSchemes((prev) => [newScheme, ...prev]);
    addNotification("moTAAdmin", "New Scheme Configured", `Scheme ${newScheme.name} has been published.`, "status_change");
  };

  const updateScheme = (id: string, updated: Partial<Scheme>) => {
    setSchemes((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  const createApplication = async (appData: {
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    state: string;
    institute: string;
    schemeCode: Scheme["code"];
    incomeAmount: number;
    marksPercent: number;
    age: number;
    category: string;
    uploadedDocs: Array<{ type: string; fileName: string; fileRef: string }>;
  }) => {
    const scheme = schemes.find((s) => s.code === appData.schemeCode) || schemes[0];
    const appId = `app-${Date.now()}`;
    const appNum = `SETU-2026-${appData.schemeCode}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Process OCR for each document via Puter.js
    const docs: DocumentItem[] = [];
    for (let i = 0; i < appData.uploadedDocs.length; i++) {
      const uDoc = appData.uploadedDocs[i];
      const ocrRes = await extractDocumentDataPuter(uDoc.type, uDoc.fileName, {
        studentName: appData.studentName,
        income: appData.incomeAmount,
        marks: appData.marksPercent,
        category: appData.category,
      });

      docs.push({
        id: `doc-${appId}-${i}`,
        applicationId: appId,
        type: uDoc.type,
        fileName: uDoc.fileName,
        fileRef: uDoc.fileRef,
        ocrExtractedFields: {
          extractedName: ocrRes.extractedName,
          extractedIncome: ocrRes.extractedIncome,
          extractedMarks: ocrRes.extractedMarks,
          extractedRollNo: ocrRes.extractedRollNo,
          extractedCategory: ocrRes.extractedCategory,
          extractedIssueDate: ocrRes.extractedIssueDate,
          extractedAuthority: ocrRes.extractedAuthority,
          rawTextSummary: ocrRes.rawTextSummary,
        },
        verificationStatus: ocrRes.verificationStatus,
        deficiencyReason: ocrRes.deficiencyReason,
        deficiencyReasonHindi: ocrRes.deficiencyReasonHindi,
        resubmissionCount: 0,
      });
    }

    // Deterministic Score
    const { aiScore, reasoning } = calculateDeterministicEligibilityScore(
      scheme,
      appData.incomeAmount,
      appData.marksPercent,
      appData.age,
      appData.category,
      docs
    );

    const newApp: Application = {
      id: appId,
      applicationNumber: appNum,
      studentId: `std-${Date.now()}`,
      studentName: appData.studentName,
      studentEmail: appData.studentEmail,
      studentPhone: appData.studentPhone,
      state: appData.state,
      institute: appData.institute,
      schemeId: scheme.id,
      schemeCode: appData.schemeCode,
      status: "Submitted",
      stageEnteredAt: new Date().toISOString(),
      stageDwellTimes: {
        Submitted: 0,
        InitialValidation: 0,
        DocumentScrutiny: 0,
        EligibilityVerification: 0,
        Screening: 0,
        Selection: 0,
        FinalDecision: 0,
      },
      documents: docs,
      aiScore,
      aiScoreReasoning: reasoning,
      incomeAmount: appData.incomeAmount,
      marksPercent: appData.marksPercent,
      age: appData.age,
      category: appData.category,
      submittedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    };

    setApplications((prev) => [newApp, ...prev]);

    addNotification(
      newApp.studentId,
      "Application Submitted Successfully",
      `Your application ${appNum} for ${scheme.name} has been received.`,
      "status_change",
      `SETU Alert: Application ${appNum} submitted successfully. Track status at portal.`
    );

    return appId;
  };

  const updateApplicationStatus = (appId: string, status: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;

        addNotification(
          app.studentId,
          "Application Stage Updated",
          `Application ${app.applicationNumber} advanced to ${status}.`,
          "status_change"
        );

        return {
          ...app,
          status,
          stageEnteredAt: new Date().toISOString(),
          lastUpdatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const applyHumanOverride = (
    appId: string,
    overrideData: { overriddenBy: string; reason: string; newStatus: ApplicationStatus; newScore?: number }
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;

        const updated: Application = {
          ...app,
          status: overrideData.newStatus,
          aiScore: overrideData.newScore !== undefined ? overrideData.newScore : app.aiScore,
          humanOverride: {
            overriddenBy: overrideData.overriddenBy,
            overriddenAt: new Date().toISOString(),
            reason: overrideData.reason,
            previousStatus: app.status,
            newStatus: overrideData.newStatus,
            previousScore: app.aiScore,
            newScore: overrideData.newScore || app.aiScore,
          },
          lastUpdatedAt: new Date().toISOString(),
        };

        addNotification(
          app.studentId,
          "Human Override & Decision Update",
          `MoTA Officer ${overrideData.overriddenBy} updated your application status to ${overrideData.newStatus}.`,
          "status_change"
        );

        return updated;
      })
    );
  };

  const resubmitDocument = async (appId: string, docId: string, fileName: string) => {
    const targetApp = applications.find((a) => a.id === appId);
    if (!targetApp) return;

    const docToUpdate = targetApp.documents.find((d) => d.id === docId);
    if (!docToUpdate) return;

    // Run Puter.js AI OCR re-verification
    const ocrRes = await extractDocumentDataPuter(docToUpdate.type, fileName, {
      studentName: targetApp.studentName,
      income: targetApp.incomeAmount,
      marks: targetApp.marksPercent,
      category: targetApp.category,
    });

    const updatedDocs = targetApp.documents.map((d) => {
      if (d.id !== docId) return d;
      return {
        ...d,
        fileName,
        ocrExtractedFields: {
          extractedName: ocrRes.extractedName,
          extractedIncome: ocrRes.extractedIncome,
          extractedMarks: ocrRes.extractedMarks,
          extractedRollNo: ocrRes.extractedRollNo,
          extractedCategory: ocrRes.extractedCategory,
          extractedIssueDate: ocrRes.extractedIssueDate,
          extractedAuthority: ocrRes.extractedAuthority,
          rawTextSummary: ocrRes.rawTextSummary,
        },
        verificationStatus: "Available" as const,
        deficiencyReason: undefined,
        deficiencyReasonHindi: undefined,
        resubmissionCount: d.resubmissionCount + 1,
        resubmittedAt: new Date().toISOString(),
      };
    });

    const scheme = schemes.find((s) => s.id === targetApp.schemeId) || schemes[0];
    const { aiScore, reasoning } = calculateDeterministicEligibilityScore(
      scheme,
      targetApp.incomeAmount,
      targetApp.marksPercent,
      targetApp.age,
      targetApp.category,
      updatedDocs
    );

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        return {
          ...app,
          documents: updatedDocs,
          aiScore,
          aiScoreReasoning: reasoning,
          lastUpdatedAt: new Date().toISOString(),
        };
      })
    );

    addNotification(
      targetApp.studentId,
      "Document Resubmitted & Re-verified",
      `Your document '${docToUpdate.type}' was re-uploaded and cleared.`,
      "deficiency"
    );
  };

  const retryAiCheck = async (appId: string, docId: string) => {
    const targetApp = applications.find((a) => a.id === appId);
    if (!targetApp) return;

    const docToUpdate = targetApp.documents.find((d) => d.id === docId);
    if (!docToUpdate) return;

    const ocrRes = await extractDocumentDataPuter(docToUpdate.type, docToUpdate.fileName, {
      studentName: targetApp.studentName,
      income: targetApp.incomeAmount,
      marks: targetApp.marksPercent,
      category: targetApp.category,
    });

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const updatedDocs = app.documents.map((d) => {
          if (d.id !== docId) return d;
          return {
            ...d,
            ocrExtractedFields: {
              extractedName: ocrRes.extractedName,
              extractedIncome: ocrRes.extractedIncome,
              extractedMarks: ocrRes.extractedMarks,
              extractedRollNo: ocrRes.extractedRollNo,
              extractedCategory: ocrRes.extractedCategory,
              extractedIssueDate: ocrRes.extractedIssueDate,
              extractedAuthority: ocrRes.extractedAuthority,
              rawTextSummary: ocrRes.rawTextSummary,
            },
            verificationStatus: ocrRes.verificationStatus,
            deficiencyReason: ocrRes.deficiencyReason,
            deficiencyReasonHindi: ocrRes.deficiencyReasonHindi,
          };
        });
        return { ...app, documents: updatedDocs };
      })
    );
  };

  const raiseGrievance = (appId: string, subject: string, description: string) => {
    const targetApp = applications.find((a) => a.id === appId);
    if (!targetApp) return;

    const raisedAt = new Date().toISOString();
    const slaDeadline = new Date(Date.now() + 7 * 86400000).toISOString(); // 7 days SLA

    const newGrievance: Grievance = {
      id: `grv-${Date.now()}`,
      applicationId: appId,
      applicationNumber: targetApp.applicationNumber,
      studentName: targetApp.studentName,
      schemeName: targetApp.schemeCode,
      subject,
      description,
      raisedAt,
      slaDeadline,
      status: "Open",
      escalationLevel: 1,
    };

    setGrievances((prev) => [newGrievance, ...prev]);

    addNotification(
      "moTAAdmin",
      "Grievance Filed by Applicant",
      `Grievance raised for ${targetApp.applicationNumber} (SLA Deadline: 7 Days).`,
      "grievance"
    );
  };

  const resolveGrievance = (grievanceId: string, notes: string) => {
    setGrievances((prev) =>
      prev.map((g) => {
        if (g.id !== grievanceId) return g;
        return {
          ...g,
          status: "Resolved",
          resolvedAt: new Date().toISOString(),
          resolutionNotes: notes,
        };
      })
    );
  };

  const releaseDisbursement = (
    schemeId: string,
    appId: string,
    studentName: string,
    quarter: string,
    amount: number
  ) => {
    const newDisb: Disbursement = {
      id: `disb-${Date.now()}`,
      schemeId,
      applicationId: appId,
      studentName,
      quarter,
      amountReleased: amount,
      releasedAt: new Date().toISOString().split("T")[0],
      status: "Disbursed",
      transactionRef: `PFMS/2026/MOTA/${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setDisbursements((prev) => [newDisb, ...prev]);
  };

  const resetToSeedData = () => {
    const seedApps = generateSeedApplications();
    setSchemes(INITIAL_SCHEMES);
    setApplications(seedApps);
    setGrievances(INITIAL_GRIEVANCES);
    setDisbursements(INITIAL_DISBURSEMENTS);
    setNotifications([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <SetuContext.Provider
      value={{
        role,
        setRole,
        schemes,
        applications,
        grievances,
        disbursements,
        notifications,
        selectedAppId,
        setSelectedAppId,
        addScheme,
        updateScheme,
        createApplication,
        updateApplicationStatus,
        applyHumanOverride,
        resubmitDocument,
        retryAiCheck,
        raiseGrievance,
        resolveGrievance,
        releaseDisbursement,
        resetToSeedData,
        markNotificationRead,
      }}
    >
      {children}
    </SetuContext.Provider>
  );
};

export const useSetu = () => {
  const context = useContext(SetuContext);
  if (!context) {
    throw new Error("useSetu must be used within a SetuProvider");
  }
  return context;
};
