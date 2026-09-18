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
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8 text-stone-900">
      {/* Admin Top Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E2D7] shadow-md space-y-5 relative overflow-hidden">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-900 text-xs px-3 py-1 rounded-full border border-amber-300 mb-2 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#C58B2B]" />
              <span>Ministry of Tribal Affairs Executive Command Center</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
              MoTA Administrative Control Portal <span className="font-hindi text-[#C58B2B] font-normal">(सेतु)</span>
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm max-w-2xl mt-1 leading-relaxed">
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
        <div className="pt-3 flex flex-wrap gap-2 border-t border-stone-200 font-semibold text-xs">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-[#1E2B37] text-white font-bold shadow-xs"
                : "bg-[#FAF8F5] text-stone-700 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>Dashboard & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab("scrutiny")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "scrutiny"
                ? "bg-[#1E2B37] text-white font-bold shadow-xs"
                : "bg-[#FAF8F5] text-stone-700 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            <FileCheck className="w-4 h-4 text-amber-400" />
            <span>Scrutiny Workbench ({totalApps})</span>
          </button>

          <button
            onClick={() => setActiveTab("schemes")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "schemes"
                ? "bg-[#1E2B37] text-white font-bold shadow-xs"
                : "bg-[#FAF8F5] text-stone-700 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Scheme Rule Engine ({schemes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("grievances")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all relative cursor-pointer ${
              activeTab === "grievances"
                ? "bg-[#1E2B37] text-white font-bold shadow-xs"
                : "bg-[#FAF8F5] text-stone-700 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Grievance Desk ({grievances.length})</span>
            {grievances.some((g) => g.status === "Escalated") && (
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping absolute top-1 right-1"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("fundpulse")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "fundpulse"
                ? "bg-[#1E2B37] text-white font-bold shadow-xs"
                : "bg-[#FAF8F5] text-stone-700 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Fund Pulse & Fellowships</span>
          </button>
        </div>
      </div>

      {/* Standard KPI Summary Bar */}
      {activeTab === "dashboard" && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 text-xs">
          <div className="bg-white border border-[#E7E2D7] p-4.5 rounded-2xl space-y-1 shadow-xs">
            <span className="text-stone-500 font-semibold block text-[10px] uppercase tracking-wider">
              Total Applications
            </span>
            <div className="font-display text-3xl font-black text-stone-900 font-mono">{totalApps}</div>
            <span className="text-[10px] text-stone-500">Across 10 ST States</span>
          </div>

          <div className="bg-white border border-[#E7E2D7] p-4.5 rounded-2xl space-y-1 shadow-xs">
            <span className="text-stone-500 font-semibold block text-[10px] uppercase tracking-wider">
              Eligible Fit (&gt;75)
            </span>
            <div className="font-display text-3xl font-black text-emerald-700 font-mono">
              {eligibleCount} <span className="text-xs font-normal">({Math.round((eligibleCount / totalApps) * 100)}%)</span>
            </div>
            <span className="text-[10px] text-emerald-800 font-semibold">Deterministic Verified</span>
          </div>

          <div className="bg-white border border-[#E7E2D7] p-4.5 rounded-2xl space-y-1 shadow-xs">
            <span className="text-stone-500 font-semibold block text-[10px] uppercase tracking-wider">
              Under Scrutiny
            </span>
            <div className="font-display text-3xl font-black text-amber-800 font-mono">{UnderVerificationCount}</div>
            <span className="text-[10px] text-stone-500">Document Audit Active</span>
          </div>

          <div className="bg-white border border-[#E7E2D7] p-4.5 rounded-2xl space-y-1 shadow-xs">
            <span className="text-stone-500 font-semibold block text-[10px] uppercase tracking-wider">
              Deficiencies Flagged
            </span>
            <div className="font-display text-3xl font-black text-rose-700 font-mono">{deficientCount}</div>
            <span className="text-[10px] text-rose-800 font-semibold">Puter AI English & Hindi</span>
          </div>

          <div className="bg-white border border-[#E7E2D7] p-4.5 rounded-2xl space-y-1 shadow-xs col-span-2 sm:col-span-1">
            <span className="text-stone-500 font-semibold block text-[10px] uppercase tracking-wider">
              Final Sanctions
            </span>
            <div className="font-display text-3xl font-black text-indigo-900 font-mono">{selectedCount}</div>
            <span className="text-[10px] text-stone-500">Selected & Disbursed</span>
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

