"use client";

import React from "react";
import { ApplicationStatus } from "@/types";
import { Check, Clock, AlertTriangle, ChevronRight } from "lucide-react";

interface StatusTimelineProps {
  currentStatus: ApplicationStatus;
  stageDwellTimes: Record<ApplicationStatus, number>;
  stageEnteredAt: string;
}

const STAGES: { id: ApplicationStatus; label: string; hindi: string; desc: string }[] = [
  { id: "Submitted", label: "Submitted", hindi: "जमा किया गया", desc: "Application received at portal" },
  { id: "InitialValidation", label: "Initial Validation", hindi: "प्रारंभिक सत्यापन", desc: "Basic identity & portal checks" },
  { id: "DocumentScrutiny", label: "Document Scrutiny", hindi: "दस्तावेज़ जांच", desc: "AI OCR & authority stamp audit" },
  { id: "EligibilityVerification", label: "Eligibility Verification", hindi: "पात्रता पुष्टि", desc: "Statutory income & category rules" },
  { id: "Screening", label: "Screening", hindi: "स्क्रीनिंग", desc: "State Nodal Officer evaluation" },
  { id: "Selection", label: "Selection", hindi: "चयन", desc: "MoTA Selection Committee merit list" },
  { id: "FinalDecision", label: "Final Decision", hindi: "अंतिम निर्णय", desc: "Disbursement sanction & letter" },
];

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus, stageDwellTimes, stageEnteredAt }) => {
  const currentIndex = STAGES.findIndex((s) => s.id === currentStatus);

  // Calculate live days in current stage
  const daysInCurrentStage = Math.max(
    1,
    Math.floor((Date.now() - new Date(stageEnteredAt).getTime()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100">
      <div className="flex flex-wrap justify-between items-center mb-6 pb-3 border-b border-slate-800 gap-2">
        <div>
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <span>Official Application Lifecycle Timeline</span>
            <span className="text-xs bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-500/30">
              7 Official Stages
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Real-time stage dwell tracking & statutory transparency audit.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <Clock className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-slate-300">
            Current Stage Dwell: <strong className="text-amber-300 font-mono">{daysInCurrentStage} Days</strong>
          </span>
        </div>
      </div>

      {/* Stage Stepper Horizontal Grid */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {STAGES.map((stage, idx) => {
            const isPassed = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isPending = idx > currentIndex;

            // Days spent in this stage
            const dwellDays = isCurrent ? daysInCurrentStage : stageDwellTimes[stage.id] || 0;
            const isDelayed = dwellDays >= 10;

            return (
              <div
                key={stage.id}
                className={`relative p-3 rounded-xl border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? "bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50"
                    : isPassed
                    ? "bg-slate-950 border-emerald-800/60 text-slate-300"
                    : "bg-slate-950/40 border-slate-800/80 text-slate-500"
                }`}
              >
                {/* Stage Header & Icon */}
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      isPassed
                        ? "bg-emerald-500 text-slate-950"
                        : isCurrent
                        ? "bg-amber-500 text-slate-950 font-black animate-pulse"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                  </div>

                  {/* Days Badge */}
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isDelayed
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        : isCurrent
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-slate-800/80 text-slate-400"
                    }`}
                  >
                    {dwellDays}d
                  </span>
                </div>

                {/* Stage Names */}
                <div>
                  <div
                    className={`font-bold text-xs leading-tight mb-0.5 ${
                      isCurrent ? "text-amber-300" : isPassed ? "text-slate-200" : "text-slate-400"
                    }`}
                  >
                    {stage.label}
                  </div>
                  <div className="text-[10px] text-slate-400 font-hindi leading-tight">{stage.hindi}</div>
                </div>

                {/* Delay Warning if applicable */}
                {isDelayed && (
                  <div className="mt-2 flex items-center space-x-1 text-[10px] text-rose-400 font-semibold bg-rose-950/40 p-1 rounded">
                    <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">Bottleneck</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
