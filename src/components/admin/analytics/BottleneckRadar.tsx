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
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-slate-100">
      {/* Radar Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-mono bg-rose-500/20 text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-500/30 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Differentiator #1 • Real-Time Bureaucracy Radar</span>
            </span>
          </div>
          <h3 className="text-xl font-bold text-white">Bottleneck Radar & Stage Dwell Analytics</h3>
          <p className="text-xs text-slate-400">
            Identifies administrative delays by stage, scheme, and state (sorted worst-first).
          </p>
        </div>

        {/* Scheme Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          {["ALL", "NFST", "NOS", "PreMatric", "PostMatric"].map((code) => (
            <button
              key={code}
              onClick={() => setSelectedSchemeFilter(code)}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedSchemeFilter === code
                  ? "bg-amber-500 text-slate-950 font-bold shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* Worst Bottlenecks Summary Banner */}
      {sortedBottlenecks[0] && (
        <div className="bg-rose-950/40 border border-rose-800/80 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-rose-500/20 p-2.5 rounded-xl text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-rose-300 font-bold uppercase tracking-wider block">
                Primary Bureaucratic Bottleneck Identified
              </span>
              <span className="text-sm font-bold text-white">
                Stage &apos;{sortedBottlenecks[0].stage}&apos; averaging{" "}
                <strong className="text-rose-300 font-mono text-base">{sortedBottlenecks[0].avg} Days</strong> per candidate.
              </span>
            </div>
          </div>
          <span className="text-xs bg-rose-500/20 text-rose-300 px-3 py-1 rounded-lg font-mono font-bold border border-rose-500/40">
            Action: Re-allocate State Verifiers
          </span>
        </div>
      )}

      {/* Grid: Stage Bar Chart & State Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Stage Dwell Time Bar List (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex justify-between items-center">
            <span>Average Dwell Time by Lifecycle Stage (Days)</span>
            <span className="text-slate-500 font-mono">Sorted Worst-First</span>
          </h4>

          <div className="space-y-3">
            {sortedBottlenecks.map((item) => {
              const maxVal = sortedBottlenecks[0]?.avg || 1;
              const barPercent = Math.min(100, Math.round((item.avg / maxVal) * 100));
              const isHighDelay = item.avg >= 10;

              return (
                <div key={item.stage} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">{item.stage}</span>
                    <div className="flex items-center space-x-2 font-mono">
                      <span className="text-slate-400 text-[11px]">({item.count} apps)</span>
                      <span
                        className={`font-bold ${
                          isHighDelay ? "text-rose-400" : item.avg >= 5 ? "text-amber-400" : "text-emerald-400"
                        }`}
                      >
                        {item.avg} Days
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isHighDelay
                          ? "bg-gradient-to-r from-rose-600 to-rose-400"
                          : item.avg >= 5
                          ? "bg-gradient-to-r from-amber-600 to-amber-400"
                          : "bg-gradient-to-r from-emerald-600 to-emerald-400"
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
        <div className="lg:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
            State Document Scrutiny Dwell Heatmap
          </h4>

          <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
            {stateBottlenecks.map((s) => {
              const isCritical = s.docScrutinyAvg >= 12;
              return (
                <div
                  key={s.state}
                  className={`p-3 rounded-xl border flex justify-between items-center text-xs transition-all ${
                    isCritical
                      ? "bg-rose-950/30 border-rose-800/80 text-rose-200"
                      : "bg-slate-900/60 border-slate-800 text-slate-300"
                  }`}
                >
                  <div>
                    <span className="font-bold text-slate-200 block">{s.state}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{s.count} Total Applications</span>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-black font-mono text-sm ${
                        isCritical ? "text-rose-400" : "text-amber-300"
                      }`}
                    >
                      {s.docScrutinyAvg} Days
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
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
