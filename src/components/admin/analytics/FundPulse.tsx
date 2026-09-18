"use client";

import React, { useState, useEffect } from "react";
import { Scheme, Disbursement, Application } from "@/types";
import { useSetu } from "@/context/SetuContext";
import {
  Flame,
  AlertCircle,
  CheckCircle2,
  Send,
  Calendar,
  Zap,
  RotateCcw,
  Wrench,
  FlaskConical,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { INITIAL_DISBURSEMENTS } from "@/lib/seedData";

interface FundPulseProps {
  schemes: Scheme[];
  disbursements: Disbursement[];
  applications: Application[];
}

export const FundPulse: React.FC<FundPulseProps> = ({ schemes, disbursements, applications }) => {
  const { releaseDisbursement: contextReleaseDisbursement, resetToSeedData } = useSetu();
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(schemes[0]?.id || "");
  const [selectedQuarter, setSelectedQuarter] = useState<string>("Q3 FY26 (Oct-Dec)");
  const [isReleasingId, setIsReleasingId] = useState<string | null>(null);

  // Requirement 3: Demo Tools panel off by default for live judge view
  const [showDemoTools, setShowDemoTools] = useState<boolean>(false);

  // Live Convex query for Single Source of Truth
  const convexDisbursements = useQuery(api.disbursements.getDisbursements);
  const releaseDisbursementMutation = useMutation(api.disbursements.releaseDisbursement);
  const seedDisbursementsMutation = useMutation(api.disbursements.seedDisbursements);
  const resetDisbursementsMutation = useMutation(api.disbursements.resetDisbursements);

  // Auto-seed Convex disbursements table if empty on initial load
  useEffect(() => {
    if (convexDisbursements && convexDisbursements.length === 0) {
      seedDisbursementsMutation({ disbursements: INITIAL_DISBURSEMENTS }).catch((err) => {
        console.error("Failed to seed initial disbursements in Convex:", err);
      });
    }
  }, [convexDisbursements, seedDisbursementsMutation]);

  // Use live Convex query data as single source of truth
  const liveDisbursements: Disbursement[] =
    convexDisbursements && convexDisbursements.length > 0
      ? convexDisbursements.map((d: any) => ({
          id: String(d._id || d.id || `disb-${Math.random()}`),
          schemeId: d.schemeId,
          applicationId: d.applicationId,
          studentName: d.studentName,
          quarter: d.quarter,
          amountReleased: d.amountReleased,
          releasedAt: d.releasedAt,
          status: d.status,
          transactionRef: d.transactionRef,
        }))
      : disbursements.length > 0
      ? disbursements
      : INITIAL_DISBURSEMENTS;

  const selectedScheme = schemes.find((s) => s.id === selectedSchemeId) || schemes[0];

  // Scheme matching helper
  const isSchemeMatch = (dSchemeId: string, schemeId: string, schemeCode: string) => {
    return (
      dSchemeId === schemeId ||
      dSchemeId === schemeCode ||
      dSchemeId === `scheme-${schemeCode.toLowerCase()}`
    );
  };

  // Requirement 1: Single Source of Truth - Disbursed Stipends total sum directly from live query
  const schemeDisbursements = liveDisbursements.filter((d) =>
    isSchemeMatch(d.schemeId, selectedScheme.id, selectedScheme.code)
  );
  const totalReleased = schemeDisbursements.reduce((acc, d) => acc + d.amountReleased, 0);

  const annualBudget = selectedScheme?.currentYearBudget || 10000000;
  const rawBurnRatePercent = Math.round((totalReleased / annualBudget) * 100);
  const isOverAllocated = totalReleased > annualBudget;

  // Requirement 3: Burn-Rate & Exhaustion Forecast Calculation
  const schemeStartDate = selectedScheme?.applicationWindow?.startDate
    ? new Date(selectedScheme.applicationWindow.startDate)
    : new Date("2026-01-01");
  const now = new Date();
  const daysElapsed = Math.max(0, (now.getTime() - schemeStartDate.getTime()) / (1000 * 60 * 60 * 24));
  const quartersElapsed = daysElapsed / 91.25; // ~91.25 days per quarter

  const burnRatePerQuarter = quartersElapsed > 0 ? totalReleased / quartersElapsed : 0;

  const statutoryTotalQuarters = (selectedScheme?.allocatedYears || 5) * 4;
  const statutoryQuartersRemaining = Math.max(0, statutoryTotalQuarters - quartersElapsed);
  const remainingCorpus = Math.max(0, selectedScheme.totalCorpus - totalReleased);

  let forecastText = "No Data";
  let forecastSubtext = "Insufficient disbursement history for forecast";
  let isAtRisk = false;
  let projectedQuartersRemaining: number | null = null;

  if (totalReleased > 0 && burnRatePerQuarter > 0) {
    projectedQuartersRemaining = remainingCorpus / burnRatePerQuarter;
    isAtRisk = projectedQuartersRemaining < statutoryQuartersRemaining;

    if (projectedQuartersRemaining > 100) {
      forecastText = "Fully Funded";
    } else {
      forecastText = `${projectedQuartersRemaining.toFixed(1)} Quarters Left`;
    }

    if (isAtRisk) {
      const earlyDiff = (statutoryQuartersRemaining - projectedQuartersRemaining).toFixed(1);
      forecastSubtext = `⚠️ Risk of Early Exhaustion (~${earlyDiff} qtrs before statutory end)`;
    } else {
      forecastSubtext = `✓ On Schedule (Sufficient for ${selectedScheme.allocatedYears}-yr statutory budget)`;
    }
  }

  // Fellow reconciliation: Combine candidate list from applications + any simulation/extra fellows with disbursements
  const baseFellows = applications.filter(
    (a) => a.schemeCode === selectedScheme?.code && (a.status === "FinalDecision" || a.status === "Selection")
  );

  const extraDisbAppIds = Array.from(
    new Set(
      schemeDisbursements
        .map((d) => d.applicationId)
        .filter((appId) => !baseFellows.some((f) => f.id === appId || f.studentId === appId))
    )
  );

  const extraFellows: Application[] = extraDisbAppIds.map((appId) => {
    const existingApp = applications.find((a) => a.id === appId || a.studentId === appId);
    const sampleDisb = schemeDisbursements.find((d) => d.applicationId === appId);

    // Requirement 1: Ensure simulation entries NEVER reuse real applicant names like "Birsa Munda"
    let simName = sampleDisb?.studentName || "[SIMULATION] High-Burn Test Fellow";
    if (
      simName.toLowerCase().includes("birsa") ||
      appId.includes("sim") ||
      appId === "app-7676" ||
      appId === "app-sim-test" ||
      appId === "app-sim-7676" ||
      !simName.startsWith("[SIMULATION]")
    ) {
      simName = "[SIMULATION] High-Burn Test Fellow";
    }

    if (existingApp && !appId.includes("sim") && !simName.startsWith("[SIMULATION]")) {
      return existingApp;
    }

    const cleanAppSuffix = appId.replace(/[^0-9]/g, "").slice(-4) || "7676";

    return {
      id: appId,
      applicationNumber: `SETU-2026-SIM-${cleanAppSuffix}`,
      studentId: appId,
      studentName: simName,
      studentEmail: "simulation@mota.gov.in",
      studentPhone: "+91 9000000000",
      state: "Central MoTA",
      institute: "High-Burn Forecast Simulation Desk",
      schemeId: selectedScheme.id,
      schemeCode: selectedScheme.code,
      status: "FinalDecision",
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
      documents: [],
      aiScore: 100,
      aiScoreReasoning: { scoreBreakdown: [], summary: "Test Simulation Entry" },
      incomeAmount: 100000,
      marksPercent: 85,
      age: 25,
      category: "ST",
      submittedAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    };
  });

  const displayedFellows = [...baseFellows, ...extraFellows];

  const isSimulationFellow = (fellow: Application) => {
    return (
      fellow.id.includes("sim") ||
      fellow.studentName.includes("SIMULATION") ||
      fellow.studentName.includes("Test") ||
      extraDisbAppIds.includes(fellow.id)
    );
  };

  const stipendAmount =
    selectedScheme.code === "NFST"
      ? 93000
      : selectedScheme.code === "NOS"
      ? 450000
      : selectedScheme.code === "PostMatric"
      ? 25000
      : 15000;

  const stipendLabel =
    selectedScheme.code === "NFST"
      ? "93k"
      : selectedScheme.code === "NOS"
      ? "4.5L"
      : selectedScheme.code === "PostMatric"
      ? "25k"
      : "15k";

  // Requirement 2: Fix Release Stipend Button using Convex mutation
  const handleReleaseStipend = async (fellow: Application) => {
    setIsReleasingId(fellow.id);
    try {
      await releaseDisbursementMutation({
        schemeId: selectedScheme.id,
        applicationId: fellow.id,
        studentName: fellow.studentName,
        studentEmail: fellow.studentEmail,
        quarter: selectedQuarter,
        amountReleased: stipendAmount,
      });

      if (contextReleaseDisbursement) {
        contextReleaseDisbursement(
          selectedScheme.id,
          fellow.id,
          fellow.studentName,
          selectedQuarter,
          stipendAmount
        );
      }
    } catch (err) {
      console.error("Failed to release stipend:", err);
    } finally {
      setIsReleasingId(null);
    }
  };

  // Fix 1: Attach test simulation disbursement to a clearly labeled fellow (" [SIMULATION] High-Burn Test Fellow")
  const handleSimulateHighBurnRate = async () => {
    try {
      await releaseDisbursementMutation({
        schemeId: selectedScheme.id,
        applicationId: "app-sim-7676",
        studentName: "[SIMULATION] High-Burn Test Fellow",
        studentEmail: "simulation.test@mota.gov.in",
        quarter: "Q1 FY26 Accelerated Allocation",
        amountReleased: 315000000, // ₹31.5 Crore simulated allocation to trigger early exhaustion forecast
      });
    } catch (err) {
      console.error("Failed to seed high burn rate disbursement:", err);
    }
  };

  // Requirement 4: Reset Baseline Data action (specifically Disbursements scope)
  const handleResetData = async () => {
    try {
      await resetDisbursementsMutation({ initialDisbursements: INITIAL_DISBURSEMENTS });
      if (resetToSeedData) {
        resetToSeedData();
      }
    } catch (err) {
      console.error("Failed to reset disbursements:", err);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Differentiator #2 • Fellowship & Fund Pulse</span>
            </span>
          </div>
          <h3 className="text-xl font-bold text-white">Fund Pulse & Fellowship Disbursement Management</h3>
          <p className="text-xs text-slate-400">
            Real-time burn-rate forecasting, fund exhaustion projections, and quarterly fellowship stipend releases.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Scheme Selector Pills */}
          <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
            {schemes.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSchemeId(s.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedScheme?.id === s.id
                    ? "bg-amber-500 text-slate-950 font-bold shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {s.code}
              </button>
            ))}
          </div>

          {/* Requirement 3: Demo Tools Toggle (Gated behind dev mode) */}
          <button
            onClick={() => setShowDemoTools((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all border ${
              showDemoTools
                ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md"
                : "bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800"
            }`}
            title="Toggle Demo & Test Injection Tools (off by default during live presentation)"
          >
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span>{showDemoTools ? "Hide Demo Tools" : "Demo Tools"}</span>
          </button>
        </div>
      </div>

      {/* Requirement 3: Collapsible Demo & Testing Sandbox Panel */}
      {showDemoTools && (
        <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-400 shrink-0">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-amber-300">Demo & Testing Sandbox</span>
              <p className="text-[11px] text-amber-200/70">
                Test risk alerts and simulation entry injection without affecting judge-facing default views.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSimulateHighBurnRate}
              title="Test the 'at risk of early exhaustion' alert by releasing a ₹31.5 Cr simulation payout"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>Inject Test Risk Alert (Simulate High-Burn)</span>
            </button>

            <button
              onClick={handleResetData}
              title="Reset disbursements to clean initial baseline"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Disbursements Only</span>
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">
            Total Scheme Corpus
          </span>
          <div className="text-xl font-black text-amber-400 font-mono">
            ₹{(selectedScheme.totalCorpus / 10000000).toFixed(1)} Cr
          </div>
          <span className="text-[10px] text-slate-500">{selectedScheme.allocatedYears} Year Statutory Budget</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">
            Current Year Allocation
          </span>
          <div className="text-xl font-black text-slate-100 font-mono">
            ₹{(annualBudget / 10000000).toFixed(2)} Cr
          </div>
          <span className="text-[10px] text-slate-400">FY26 Sanctioned</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">
            Disbursed Stipends
          </span>
          <div className="text-xl font-black text-emerald-400 font-mono">
            ₹{(totalReleased / 100000).toFixed(2)} Lakhs
          </div>
          <span
            className={`text-[10px] font-semibold block ${
              isOverAllocated ? "text-rose-400 font-bold animate-pulse" : "text-emerald-400"
            }`}
          >
            {isOverAllocated
              ? `⚠️ ${rawBurnRatePercent}% — Over Allocated`
              : `${rawBurnRatePercent}% of FY26 Used`}
          </span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">
            Burn Forecast Exhaustion
          </span>
          <div
            className={`text-xl font-black font-mono ${
              isAtRisk ? "text-rose-400" : "text-amber-300"
            }`}
          >
            {forecastText}
          </div>
          <span
            className={`text-[10px] font-semibold block ${
              isAtRisk ? "text-rose-400 font-bold animate-pulse" : "text-slate-400"
            }`}
          >
            {forecastSubtext}
          </span>
        </div>
      </div>

      {/* Burn Rate Visual Progress */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-300">FY26 Budget Utilization Progress</span>
          <span className={`font-mono ${isOverAllocated ? "text-rose-400 font-extrabold" : "text-amber-400"}`}>
            ₹{totalReleased.toLocaleString("en-IN")} / ₹{annualBudget.toLocaleString("en-IN")}
            {isOverAllocated && ` (⚠️ ${rawBurnRatePercent}% OVER)`}
          </span>
        </div>
        <div className="h-4 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
          {isOverAllocated ? (
            <div
              className="h-full bg-gradient-to-r from-rose-600 via-rose-500 to-red-400 rounded-full transition-all duration-700 animate-pulse border border-rose-400"
              style={{ width: "100%" }}
            />
          ) : (
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(5, rawBurnRatePercent))}%` }}
            />
          )}
        </div>
        {isOverAllocated && (
          <div className="text-[10px] text-rose-400 font-semibold flex items-center gap-1 pt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>
              ⚠️ {rawBurnRatePercent}% Utilization — Over-allocated by ₹
              {((totalReleased - annualBudget) / 100000).toFixed(2)} Lakhs beyond FY26 annual budget.
            </span>
          </div>
        )}
      </div>

      {/* Fellowship Disbursement Desk for Selected Candidates */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <h4 className="font-bold text-sm text-white">
              Selected Fellows & Quarterly Stipend Management ({displayedFellows.length})
            </h4>
            <p className="text-xs text-slate-400">
              Release quarterly fellowship stipend directly to student PFMS accounts.
            </p>
          </div>

          {/* Controls: Quarter Selector, Reset Disbursements Only */}
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="Q1 FY26 (Apr-Jun)" className="bg-slate-900">
                  Q1 FY26 (Apr-Jun)
                </option>
                <option value="Q2 FY26 (Jul-Sep)" className="bg-slate-900">
                  Q2 FY26 (Jul-Sep)
                </option>
                <option value="Q3 FY26 (Oct-Dec)" className="bg-slate-900">
                  Q3 FY26 (Oct-Dec)
                </option>
                <option value="Q4 FY26 (Jan-Mar)" className="bg-slate-900">
                  Q4 FY26 (Jan-Mar)
                </option>
              </select>
            </div>

            {/* Requirement 4: Explicit label clarifying scope */}
            <button
              onClick={handleResetData}
              title="Reset Fund Pulse disbursements back to clean initial baseline"
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-xl text-[11px] font-semibold flex items-center space-x-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Disbursements Only</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-800 max-h-[360px] overflow-y-auto pr-1">
          {displayedFellows.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">
              No selected fellows pending disbursement for {selectedScheme.code}.
            </div>
          ) : (
            displayedFellows.map((fellow) => {
              const isSim = isSimulationFellow(fellow);

              const fellowDisbs = liveDisbursements.filter(
                (d) =>
                  isSchemeMatch(d.schemeId, selectedScheme.id, selectedScheme.code) &&
                  (d.applicationId === fellow.id || d.applicationId === fellow.studentId)
              );

              const quartersPaidCount = fellowDisbs.length;
              const fellowTotalReceived = fellowDisbs.reduce((acc, d) => acc + d.amountReleased, 0);
              const isPaidForSelectedQuarter = fellowDisbs.some((d) => d.quarter === selectedQuarter);

              // Requirement 1: Ensure name is unambiguous
              const displayName =
                isSim && (fellow.studentName.toLowerCase().includes("birsa") || !fellow.studentName.startsWith("[SIMULATION]"))
                  ? "[SIMULATION] High-Burn Test Fellow"
                  : fellow.studentName;

              return (
                <div
                  key={fellow.id}
                  className={`py-3 px-3.5 rounded-2xl flex flex-wrap justify-between items-center text-xs gap-3 my-1.5 transition-all ${
                    isSim
                      ? "bg-amber-950/25 border border-dashed border-amber-500/50 shadow-inner"
                      : "bg-slate-900/40 border border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm flex items-center gap-2">
                      <span className={isSim ? "text-amber-300 font-extrabold" : "text-slate-200"}>
                        {displayName}
                      </span>
                      {/* Requirement 2: Prominent SIMULATED DATA badge */}
                      {isSim && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-black tracking-wider flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-amber-400" />
                          SIMULATED DATA
                        </span>
                      )}
                    </div>
                    <div className={`font-mono text-[11px] ${isSim ? "text-amber-400/80" : "text-slate-400"}`}>
                      App #: {fellow.applicationNumber} • {fellow.institute}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className={`font-bold font-mono ${isSim ? "text-amber-400" : "text-emerald-400"}`}>
                        ₹{fellowTotalReceived.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-slate-500">{quartersPaidCount} Quarters Paid</div>
                    </div>

                    {isPaidForSelectedQuarter ? (
                      <button
                        disabled
                        className="bg-slate-800 text-emerald-400 border border-slate-700 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center space-x-1 shadow-sm cursor-not-allowed opacity-90"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Paid ({selectedQuarter.split(" ")[0]})</span>
                      </button>
                    ) : (
                      <button
                        disabled={isReleasingId === fellow.id}
                        onClick={() => handleReleaseStipend(fellow)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center space-x-1 shadow-sm transition-all disabled:opacity-50"
                      >
                        {isReleasingId === fellow.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Release Stipend (₹{stipendLabel})</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};


