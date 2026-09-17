"use client";

import React, { useState } from "react";
import { useSetu } from "@/context/SetuContext";
import { BottleneckRadar } from "./analytics/BottleneckRadar";
import { FundPulse } from "./analytics/FundPulse";
import { ScrutinyWorkbench } from "./ScrutinyWorkbench";
import { SchemeManager } from "./SchemeManager";
import { GrievanceDesk } from "./GrievanceDesk";
import { SimulatedAdapterBadge } from "@/components/common/SimulatedAdapterBadge";
import {
  BarChart3,
  Sliders,
  FileCheck,
  HelpCircle,
  Flame,
  Users,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export const AdminPortal: React.FC = () => {
  const { applications, schemes, grievances, disbursements } = useSetu();
  const [activeTab, setActiveTab] = useState<"dashboard" | "scrutiny" | "schemes" | "grievances" | "fundpulse">(
    "dashboard"
  );

  // Standard Metrics Calculations
  const totalApps = applications.length;
  const eligibleCount = applications.filter((a) => a.aiScore >= 75).length;
  const UnderVerificationCount = applications.filter(
    (a) => a.status === "DocumentScrutiny" || a.status === "InitialValidation"
  ).length;
  const deficientCount = applications.filter((a) =>
    a.documents.some((d) => d.verificationStatus === "NeedsReview" || d.verificationStatus === "Missing")
  ).length;
  const selectedCount = applications.filter(
    (a) => a.status === "Selection" || a.status === "FinalDecision"
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-slate-100">
      {/* Admin Top Header Banner */}
      <div className="bg-gradient-to-r from-[#0F2C59] via-[#1A3A6D] to-[#0A1E3F] rounded-3xl p-6 sm:p-8 border border-blue-900/60 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 text-xs px-3 py-1 rounded-full border border-amber-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ministry of Tribal Affairs Executive Command Center</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              MoTA Administrative Control Portal <span className="font-hindi text-amber-400 font-normal">(सेतु)</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              Glass-box deterministic eligibility evaluation, Puter.js AI OCR intelligence, and real-time bottleneck radar.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <SimulatedAdapterBadge
              systemName="DigiLocker"
              description="Direct revenue state database verification adapter"
            />
            <SimulatedAdapterBadge
              systemName="PFMS / Direct Benefit Transfer (DBT)"
              description="National PFMS direct scholarship disbursement gateway"
            />
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="pt-2 flex flex-wrap gap-2 border-t border-blue-900/60 font-semibold text-xs">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === "dashboard"
                ? "bg-amber-500 text-slate-950 font-bold shadow-lg"
                : "bg-slate-950/60 text-slate-300 hover:bg-blue-900/40"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab("scrutiny")}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === "scrutiny"
                ? "bg-amber-500 text-slate-950 font-bold shadow-lg"
                : "bg-slate-950/60 text-slate-300 hover:bg-blue-900/40"
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Scrutiny Workbench ({totalApps})</span>
          </button>

          <button
            onClick={() => setActiveTab("schemes")}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === "schemes"
                ? "bg-amber-500 text-slate-950 font-bold shadow-lg"
                : "bg-slate-950/60 text-slate-300 hover:bg-blue-900/40"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Scheme Rule Engine ({schemes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("grievances")}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl transition-all relative ${
              activeTab === "grievances"
                ? "bg-amber-500 text-slate-950 font-bold shadow-lg"
                : "bg-slate-950/60 text-slate-300 hover:bg-blue-900/40"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Grievance Desk ({grievances.length})</span>
            {grievances.some((g) => g.status === "Escalated") && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute top-1 right-1"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("fundpulse")}
            className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-xl transition-all ${
              activeTab === "fundpulse"
                ? "bg-amber-500 text-slate-950 font-bold shadow-lg"
                : "bg-slate-950/60 text-slate-300 hover:bg-blue-900/40"
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Fund Pulse & Fellowships</span>
          </button>
        </div>
      </div>

      {/* Standard KPI Cards (Rendered across Dashboard & Overview) */}
      {activeTab === "dashboard" && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-lg">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">
              Total Applications
            </span>
            <div className="text-2xl font-black text-white font-mono">{totalApps}</div>
            <span className="text-[10px] text-slate-500">Across 10 ST States</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-lg">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">
              Eligible Fit (&gt;75)
            </span>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {eligibleCount} <span className="text-xs font-normal">({Math.round((eligibleCount / totalApps) * 100)}%)</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">Deterministic Verified</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-lg">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">
              Under Scrutiny
            </span>
            <div className="text-2xl font-black text-amber-400 font-mono">{UnderVerificationCount}</div>
            <span className="text-[10px] text-slate-400">Document Audit Active</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-lg">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">
              Deficiencies Flagged
            </span>
            <div className="text-2xl font-black text-rose-400 font-mono">{deficientCount}</div>
            <span className="text-[10px] text-rose-400 font-semibold">Puter AI English & Hindi</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1 shadow-lg col-span-2 sm:col-span-1">
            <span className="text-slate-400 font-semibold block text-[10px] uppercase tracking-wider">
              Final Sanctions
            </span>
            <div className="text-2xl font-black text-blue-400 font-mono">{selectedCount}</div>
            <span className="text-[10px] text-slate-400">Selected & Disbursed</span>
          </div>
        </div>
      )}

      {/* Main Tab Content Display */}
      {activeTab === "dashboard" && (
        <div className="space-y-8">
          <BottleneckRadar applications={applications} />
          <FundPulse schemes={schemes} disbursements={disbursements} applications={applications} />
        </div>
      )}

      {activeTab === "scrutiny" && <ScrutinyWorkbench />}
      {activeTab === "schemes" && <SchemeManager />}
      {activeTab === "grievances" && <GrievanceDesk />}
      {activeTab === "fundpulse" && (
        <FundPulse schemes={schemes} disbursements={disbursements} applications={applications} />
      )}
    </div>
  );
};
