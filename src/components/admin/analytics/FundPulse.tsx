"use client";

import React, { useState } from "react";
import { Scheme, Disbursement, Application } from "@/types";
import { useSetu } from "@/context/SetuContext";
import { DollarSign, Flame, AlertCircle, CheckCircle2, TrendingUp, Send, PieChart } from "lucide-react";

interface FundPulseProps {
  schemes: Scheme[];
  disbursements: Disbursement[];
  applications: Application[];
}

export const FundPulse: React.FC<FundPulseProps> = ({ schemes, disbursements, applications }) => {
  const { releaseDisbursement } = useSetu();
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(schemes[0]?.id || "");
  const [releaseModalAppId, setReleaseModalAppId] = useState<string | null>(null);

  const selectedScheme = schemes.find((s) => s.id === selectedSchemeId) || schemes[0];

  // Calculate total released for selected scheme
  const schemeDisbursements = disbursements.filter((d) => d.schemeId === selectedScheme?.id);
  const totalReleased = schemeDisbursements.reduce((acc, d) => acc + d.amountReleased, 0);

  // Annual budget & Corpus stats
  const annualBudget = selectedScheme?.currentYearBudget || 10000000;
  const remainingAnnual = Math.max(0, annualBudget - totalReleased);
  const burnRatePercent = Math.min(100, Math.round((totalReleased / annualBudget) * 100));

  // Exhaustion Forecasting Logic
  // Average quarterly burn based on disbursements
  const qBurn = totalReleased > 0 ? totalReleased : 1500000;
  const quartersRemaining = qBurn > 0 ? (remainingAnnual / qBurn).toFixed(1) : "4.0";
  const isAtRisk = burnRatePercent > 70;

  // Selected candidates for fellowship management under this scheme
  const selectedCandidates = applications.filter(
    (a) => a.schemeCode === selectedScheme?.code && (a.status === "FinalDecision" || a.status === "Selection")
  );

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
      </div>

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
          <span className="text-[10px] text-emerald-400 font-semibold">{burnRatePercent}% of FY26 Used</span>
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
            {quartersRemaining} Quarters Left
          </div>
          <span className="text-[10px] text-slate-400">
            {isAtRisk ? "⚠️ Risk of Early Exhaustion" : "On Schedule"}
          </span>
        </div>
      </div>

      {/* Burn Rate Visual Progress */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-slate-300">FY26 Budget Utilization Progress</span>
          <span className="text-amber-400 font-mono">
            ₹{totalReleased.toLocaleString("en-IN")} / ₹{annualBudget.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="h-4 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full transition-all duration-700"
            style={{ width: `${Math.max(5, burnRatePercent)}%` }}
          />
        </div>
      </div>

      {/* Fellowship Disbursement Desk for Selected Candidates */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-bold text-sm text-white">
              Selected Fellows & Quarterly Stipend Management ({selectedCandidates.length})
            </h4>
            <p className="text-xs text-slate-400">
              Release quarterly fellowship stipend directly to student PFMS accounts.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-800 max-h-[300px] overflow-y-auto">
          {selectedCandidates.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">
              No selected fellows pending disbursement for {selectedScheme.code}.
            </div>
          ) : (
            selectedCandidates.map((fellow) => {
              const fellowDisbs = disbursements.filter((d) => d.applicationId === fellow.id);
              const totalFellowReceived = fellowDisbs.reduce((acc, d) => acc + d.amountReleased, 0);

              return (
                <div key={fellow.id} className="py-3 flex flex-wrap justify-between items-center text-xs gap-3">
                  <div>
                    <div className="font-bold text-slate-200 text-sm">{fellow.studentName}</div>
                    <div className="text-slate-400 font-mono text-[11px]">
                      App #: {fellow.applicationNumber} • {fellow.institute}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="font-bold text-emerald-400 font-mono">
                        ₹{totalFellowReceived.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-slate-500">{fellowDisbs.length} Quarters Paid</div>
                    </div>

                    <button
                      onClick={() => {
                        releaseDisbursement(
                          selectedScheme.id,
                          fellow.id,
                          fellow.studentName,
                          "Q3 FY26 Fellowship Stipend",
                          selectedScheme.code === "NFST" ? 93000 : selectedScheme.code === "NOS" ? 450000 : 15000
                        );
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center space-x-1 shadow-sm transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>
                        Release Stipend (₹
                        {selectedScheme.code === "NFST"
                          ? "93k"
                          : selectedScheme.code === "NOS"
                          ? "4.5L"
                          : "15k"}
                        )
                      </span>
                    </button>
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
