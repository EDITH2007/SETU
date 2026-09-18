"use client";

import React, { useState } from "react";
import { Application, ApplicationStatus } from "@/types";
import { AlertTriangle, Clock, TrendingUp, Filter, ShieldAlert } from "lucide-react";

interface BottleneckRadarProps {
  applications: Application[];
}

export const BottleneckRadar: React.FC<BottleneckRadarProps> = ({ applications }) => {
  const [selectedSchemeFilter, setSelectedSchemeFilter] = useState<string>("ALL");

  const filteredApps =
    selectedSchemeFilter === "ALL"
      ? applications
      : applications.filter((a) => a.schemeCode === selectedSchemeFilter);

  // Calculate average dwell time per stage
  const stagesList: ApplicationStatus[] = [
    "Submitted",
    "InitialValidation",
    "DocumentScrutiny",
    "EligibilityVerification",
    "Screening",
    "Selection",
    "FinalDecision",
  ];

  const stageDwellAverages = stagesList.map((stage) => {
    const appsInOrPastStage = filteredApps.filter((a) => a.stageDwellTimes[stage] !== undefined);
    const totalDays = appsInOrPastStage.reduce((acc, app) => acc + (app.stageDwellTimes[stage] || 0), 0);
    const avg = appsInOrPastStage.length > 0 ? Number((totalDays / appsInOrPastStage.length).toFixed(1)) : 0;
    return { stage, avg, count: appsInOrPastStage.length };
  });

  // Sort worst bottlenecks first
  const sortedBottlenecks = [...stageDwellAverages].sort((a, b) => b.avg - a.avg);

  // Group dwell times by state for state heatmap
  const states = Array.from(new Set(applications.map((a) => a.state)));
  const stateBottlenecks = states.map((state) => {
    const stateApps = filteredApps.filter((a) => a.state === state);
    const docScrutinyAvg =
      stateApps.length > 0
        ? Number(
            (
              stateApps.reduce((acc, app) => acc + (app.stageDwellTimes["DocumentScrutiny"] || 0), 0) /
              stateApps.length
            ).toFixed(1)
          )
        : 0;

    return { state, docScrutinyAvg, count: stateApps.length };
  }).sort((a, b) => b.docScrutinyAvg - a.docScrutinyAvg);

  return (
    <div className="bg-white border border-[#E7E2D7] rounded-3xl p-6 shadow-md space-y-6 text-stone-900">
      {/* Radar Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-mono bg-rose-50 text-rose-900 px-2.5 py-0.5 rounded-full border border-rose-300 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
              <span>Differentiator #1 • Real-Time Bureaucracy Radar</span>
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-stone-900">Bottleneck Radar & Stage Dwell Analytics</h3>
          <p className="text-xs text-stone-600 mt-0.5">
            Identifies administrative delays by stage, scheme, and state (sorted worst-first).
          </p>
        </div>

        {/* Scheme Filter Pills */}
        <div className="flex items-center space-x-1 bg-[#FAF8F5] p-1.5 rounded-2xl border border-stone-200 text-xs font-semibold">
          <Filter className="w-3.5 h-3.5 text-stone-500 ml-1.5 shrink-0" />
          {["ALL", "NFST", "NOS", "PreMatric", "PostMatric"].map((code) => (
            <button
              key={code}
              onClick={() => setSelectedSchemeFilter(code)}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                selectedSchemeFilter === code
                  ? "bg-[#1E2B37] text-white font-bold shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* Worst Bottlenecks Summary Banner */}
      {sortedBottlenecks[0] && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="bg-rose-100 p-2.5 rounded-2xl text-rose-800 border border-rose-300 shrink-0">
              <ShieldAlert className="w-6 h-6 text-rose-700" />
            </div>
            <div>
              <span className="text-[11px] text-rose-900 font-bold uppercase tracking-wider block">
                Primary Bureaucratic Bottleneck Identified
              </span>
              <span className="text-sm font-bold text-stone-900">
                Stage &apos;{sortedBottlenecks[0].stage}&apos; averaging{" "}
                <strong className="text-rose-900 font-mono text-base">{sortedBottlenecks[0].avg} Days</strong> per candidate.
              </span>
            </div>
          </div>
          <span className="text-xs bg-rose-100 text-rose-900 px-3 py-1.5 rounded-xl font-mono font-bold border border-rose-300">
            Action: Re-allocate State Verifiers
          </span>
        </div>
      )}

      {/* Grid: Stage Bar Chart & State Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Stage Dwell Time Bar List (7 cols) */}
        <div className="lg:col-span-7 bg-[#FAF8F5] p-5 sm:p-6 rounded-3xl border border-stone-200 space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-stone-600 flex justify-between items-center">
            <span>Average Dwell Time by Lifecycle Stage (Days)</span>
            <span className="text-stone-500 font-mono">Sorted Worst-First</span>
          </h4>

          <div className="space-y-3.5">
            {sortedBottlenecks.map((item) => {
              const maxVal = sortedBottlenecks[0]?.avg || 1;
              const barPercent = Math.min(100, Math.round((item.avg / maxVal) * 100));
              const isHighDelay = item.avg >= 10;

              return (
                <div key={item.stage} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-stone-900">{item.stage}</span>
                    <div className="flex items-center space-x-2 font-mono">
                      <span className="text-stone-500 text-[11px]">({item.count} apps)</span>
                      <span
                        className={`font-bold ${
                          isHighDelay ? "text-rose-700 font-black" : item.avg >= 5 ? "text-amber-800" : "text-emerald-800"
                        }`}
                      >
                        {item.avg} Days
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="h-3 bg-stone-200/70 rounded-full overflow-hidden p-0.5 border border-stone-300">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isHighDelay
                          ? "bg-gradient-to-r from-rose-700 to-rose-500"
                          : item.avg >= 5
                          ? "bg-gradient-to-r from-amber-600 to-amber-500"
                          : "bg-gradient-to-r from-emerald-700 to-emerald-500"
                      }`}
                      style={{ width: `${barPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: State Scrutiny Heatmap List (5 cols) */}
        <div className="lg:col-span-5 bg-[#FAF8F5] p-5 sm:p-6 rounded-3xl border border-stone-200 space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-stone-600">
            State Document Scrutiny Dwell Heatmap
          </h4>

          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            {stateBottlenecks.map((s) => {
              const isCritical = s.docScrutinyAvg >= 12;
              return (
                <div
                  key={s.state}
                  className={`p-3.5 rounded-2xl border flex justify-between items-center text-xs transition-all ${
                    isCritical
                      ? "bg-rose-50 border-rose-300 text-rose-950 shadow-xs"
                      : "bg-white border-stone-200 text-stone-800 shadow-xs"
                  }`}
                >
                  <div>
                    <span className="font-bold text-stone-900 block">{s.state}</span>
                    <span className="text-[10px] text-stone-500 font-mono">{s.count} Total Applications</span>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-black font-mono text-sm ${
                        isCritical ? "text-rose-700" : "text-[#C58B2B]"
                      }`}
                    >
                      {s.docScrutinyAvg} Days
                    </div>
                    <span className="text-[10px] text-stone-600 uppercase tracking-wider font-bold">
                      {isCritical ? "Critical Delay" : "Normal Flow"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

