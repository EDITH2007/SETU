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

  const handleSimulateHighBurnRate = async () => {
    try {
      await releaseDisbursementMutation({
        schemeId: selectedScheme.id,
        applicationId: "app-sim-7676",
        studentName: "[SIMULATION] High-Burn Test Fellow",
        studentEmail: "simulation.test@mota.gov.in",
        quarter: "Q1 FY26 Accelerated Allocation",
        amountReleased: 315000000,
      });
    } catch (err) {
      console.error("Failed to seed high burn rate disbursement:", err);
    }
  };

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
    <div className="bg-white border border-[#E7E2D7] rounded-3xl p-6 shadow-xl space-y-6 text-[#1C1917]">
      {/* Header Banner */}
      <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-[#E7E2D7]">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-mono bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300 font-bold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#C58B2B]" />
              <span>Differentiator #2 • Fellowship & Fund Pulse</span>
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1C1917]">Fund Pulse & Fellowship Disbursement Management</h3>
          <p className="text-xs text-stone-600 mt-0.5">
            Real-time burn-rate forecasting, fund exhaustion projections, and quarterly fellowship stipend releases.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Scheme Selector Pills */}
          <div className="flex items-center space-x-1.5 bg-[#F0ECE1] p-1.5 rounded-2xl border border-[#E7E2D7] text-xs font-semibold">
            {schemes.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSchemeId(s.id)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  selectedScheme?.id === s.id
                    ? "bg-[#1E2B37] text-white font-bold shadow"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {s.code}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowDemoTools((prev) => !prev)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all border cursor-pointer ${
              showDemoTools
                ? "bg-amber-100 text-amber-900 border-amber-300 shadow-sm"
                : "bg-[#FAF8F3] hover:bg-[#F0ECE1] text-stone-700 border-[#E7E2D7]"
            }`}
            title="Toggle Demo & Test Injection Tools (off by default during live presentation)"
          >
            <Wrench className="w-3.5 h-3.5 text-[#C58B2B]" />
            <span>{showDemoTools ? "Hide Demo Tools" : "Demo Tools"}</span>
          </button>
        </div>
      </div>

      {/* Demo Tools Sandbox Panel */}
      {showDemoTools && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-100 border border-amber-300 rounded-xl text-amber-800 shrink-0">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-amber-900">Demo & Testing Sandbox</span>
              <p className="text-[11px] text-amber-800/80">
                Test risk alerts and simulation entry injection without affecting judge-facing default views.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSimulateHighBurnRate}
              title="Test the 'at risk of early exhaustion' alert by releasing a ₹31.5 Cr simulation payout"
              className="bg-[#C58B2B] hover:bg-[#B37A20] text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-md"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Inject Test Risk Alert (Simulate High-Burn)</span>
            </button>

            <button
              onClick={handleResetData}
              title="Reset disbursements to clean initial baseline"
              className="bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
              <span>Reset Disbursements Only</span>
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 text-xs">
        <div className="bg-[#FAF8F3] p-4.5 rounded-2xl border border-[#E7E2D7] space-y-1">
          <span className="text-stone-500 font-semibold block text-[10px] uppercase tracking-wider">
            Total Scheme Corpus
          </span>
          <div className="font-display text-2xl font-black text-[#C58B2B] font-mono">
            ₹{(selectedScheme.totalCorpus / 10000000).toFixed(1)} Cr
          </div>
          <span className="text-[10px] text-stone-500">{selectedScheme.allocatedYears} Year Statutory Budget</span>
        </div>

        <div className="bg-[#FAF8F3] p-4.5 rounded-2xl border border-[#E7E2D7] space-y-1">
          <span className="text-stone-500 font-semibold block text-[10px] uppercase tracking-wider">
            Current Year Allocation
          </span>
          <div className="font-display text-2xl font-black text-[#1C1917] font-mono">
            ₹{(annualBudget / 10000000).toFixed(2)} Cr
          </div>
          <span className="text-[10px] text-stone-500">FY26 Sanctioned</span>
        </div>

        <div className="bg-[#FAF8F3] p-4.5 rounded-2xl border border-[#E7E2D7] space-y-1">
          <span className="text-stone-500 font-semibold block text-[10px] uppercase tracking-wider">
            Disbursed Stipends
          </span>
          <div className="font-display text-2xl font-black text-emerald-800 font-mono">
            ₹{(totalReleased / 100000).toFixed(2)} Lakhs
          </div>
          <span
            className={`text-[10px] font-semibold block ${
              isOverAllocated ? "text-rose-700 font-bold animate-pulse" : "text-emerald-700"
            }`}
          >
            {isOverAllocated
              ? `⚠️ ${rawBurnRatePercent}% — Over Allocated`
              : `${rawBurnRatePercent}% of FY26 Used`}
          </span>
        </div>

        <div className="bg-[#FAF8F3] p-4.5 rounded-2xl border border-[#E7E2D7] space-y-1">
          <span className="text-stone-500 font-semibold block text-[10px] uppercase tracking-wider">
            Burn Forecast Exhaustion
          </span>
          <div
            className={`font-display text-2xl font-black font-mono ${
              isAtRisk ? "text-rose-700" : "text-[#C58B2B]"
            }`}
          >
            {forecastText}
          </div>
          <span
            className={`text-[10px] font-semibold block ${
              isAtRisk ? "text-rose-700 font-bold animate-pulse" : "text-stone-600"
            }`}
          >
            {forecastSubtext}
          </span>
        </div>
      </div>

      {/* Burn Rate Visual Progress */}
      <div className="bg-[#FAF8F3] p-5 rounded-2xl border border-[#E7E2D7] space-y-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-stone-800">FY26 Budget Utilization Progress</span>
          <span className={`font-mono ${isOverAllocated ? "text-rose-700 font-extrabold" : "text-[#C58B2B]"}`}>
            ₹{totalReleased.toLocaleString("en-IN")} / ₹{annualBudget.toLocaleString("en-IN")}
            {isOverAllocated && ` (⚠️ ${rawBurnRatePercent}% OVER)`}
          </span>
        </div>
        <div className="h-4 bg-[#F0ECE1] rounded-full overflow-hidden p-0.5 border border-[#E7E2D7]">
          {isOverAllocated ? (
            <div
              className="h-full bg-gradient-to-r from-rose-600 via-rose-500 to-red-400 rounded-full transition-all duration-700 animate-pulse border border-rose-400"
              style={{ width: "100%" }}
            />
          ) : (
            <div
              className="h-full bg-gradient-to-r from-emerald-600 via-amber-500 to-rose-500 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(5, rawBurnRatePercent))}%` }}
            />
          )}
        </div>
        {isOverAllocated && (
          <div className="text-[10px] text-rose-700 font-semibold flex items-center gap-1 pt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>
              ⚠️ {rawBurnRatePercent}% Utilization — Over-allocated by ₹
              {((totalReleased - annualBudget) / 100000).toFixed(2)} Lakhs beyond FY26 annual budget.
            </span>
          </div>
        )}
      </div>

      {/* Fellowship Disbursement Desk for Selected Candidates */}
      <div className="bg-[#FAF8F3] p-5 sm:p-6 rounded-3xl border border-[#E7E2D7] space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <h4 className="font-display font-bold text-base text-[#1C1917]">
              Selected Fellows & Quarterly Stipend Management ({displayedFellows.length})
            </h4>
            <p className="text-xs text-stone-600 mt-0.5">
              Release quarterly fellowship stipend directly to student PFMS accounts.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1.5 bg-white px-3.5 py-2 rounded-xl border border-[#E7E2D7] shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-[#C58B2B]" />
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                className="bg-transparent text-stone-800 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="Q1 FY26 (Apr-Jun)">Q1 FY26 (Apr-Jun)</option>
                <option value="Q2 FY26 (Jul-Sep)">Q2 FY26 (Jul-Sep)</option>
                <option value="Q3 FY26 (Oct-Dec)">Q3 FY26 (Oct-Dec)</option>
                <option value="Q4 FY26 (Jan-Mar)">Q4 FY26 (Jan-Mar)</option>
              </select>
            </div>

            <button
              onClick={handleResetData}
              title="Reset Fund Pulse disbursements back to clean initial baseline"
              className="bg-white hover:bg-stone-50 text-stone-700 border border-[#E7E2D7] px-3.5 py-2 rounded-xl text-[11px] font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
              <span>Reset Disbursements Only</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-[#E7E2D7] max-h-[380px] overflow-y-auto pr-1">
          {displayedFellows.length === 0 ? (
            <div className="py-6 text-center text-xs text-stone-500">
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

              const displayName =
                isSim && (fellow.studentName.toLowerCase().includes("birsa") || !fellow.studentName.startsWith("[SIMULATION]"))
                  ? "[SIMULATION] High-Burn Test Fellow"
                  : fellow.studentName;

              return (
                <div
                  key={fellow.id}
                  className={`py-3.5 px-4 rounded-2xl flex flex-wrap justify-between items-center text-xs gap-3 my-1.5 transition-all ${
                    isSim
                      ? "bg-amber-100/80 border border-dashed border-amber-600/70 text-amber-900 shadow-sm"
                      : "bg-white border border-[#E7E2D7] hover:border-stone-400 text-[#1C1917]"
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm flex items-center gap-2">
                      <span className={isSim ? "text-amber-950 font-extrabold" : "text-stone-900"}>
                        {displayName}
                      </span>
                      {isSim && (
                        <span className="text-[10px] bg-amber-200/90 text-amber-950 border border-amber-400 px-2.5 py-0.5 rounded-full font-black tracking-wider flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-amber-800" />
                          SIMULATED DATA
                        </span>
                      )}
                    </div>
                    <div className={`font-mono text-[11px] ${isSim ? "text-amber-800" : "text-stone-500"}`}>
                      App #: {fellow.applicationNumber} • {fellow.institute}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className={`font-bold font-mono text-sm ${isSim ? "text-amber-900" : "text-emerald-800"}`}>
                        ₹{fellowTotalReceived.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-stone-500">{quartersPaidCount} Quarters Paid</div>
                    </div>

                    {isPaidForSelectedQuarter ? (
                      <button
                        disabled
                        className="bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1 shadow-sm cursor-not-allowed opacity-90"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Paid ({selectedQuarter.split(" ")[0]})</span>
                      </button>
                    ) : (
                      <button
                        disabled={isReleasingId === fellow.id}
                        onClick={() => handleReleaseStipend(fellow)}
                        className="bg-[#1E2B37] hover:bg-[#2C3B4E] text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1 shadow-md transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isReleasingId === fellow.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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




