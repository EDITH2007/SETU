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
    <div className="bg-white border border-[#E7E2D7] rounded-3xl p-5 sm:p-6 shadow-md text-stone-900">
      <div className="flex flex-wrap justify-between items-center mb-6 pb-4 border-b border-stone-200 gap-2">
        <div>
          <h3 className="font-display font-bold text-base text-stone-900 flex items-center gap-2">
            <span>Official Application Lifecycle Timeline</span>
            <span className="text-xs bg-amber-50 text-amber-900 font-mono px-2.5 py-0.5 rounded-full border border-amber-300 font-semibold">
              7 Official Stages
            </span>
          </h3>
          <p className="text-xs text-stone-600">
            Real-time stage dwell tracking & statutory transparency audit.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#FAF8F5] px-3.5 py-1.5 rounded-xl border border-stone-200">
          <Clock className="w-4 h-4 text-[#C58B2B]" />
          <span className="text-xs text-stone-700">
            Current Stage Dwell: <strong className="text-[#C58B2B] font-mono">{daysInCurrentStage} Days</strong>
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
                className={`relative p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? "bg-amber-50/90 border-[#C58B2B] shadow-sm ring-1 ring-[#C58B2B]/40"
                    : isPassed
                    ? "bg-emerald-50/60 border-emerald-300 text-stone-800"
                    : "bg-stone-50 border-stone-200 text-stone-400"
                }`}
              >
                {/* Stage Header & Icon */}
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                      isPassed
                        ? "bg-emerald-700 text-white"
                        : isCurrent
                        ? "bg-[#1E2B37] text-white font-black animate-pulse"
                        : "bg-stone-200 text-stone-500"
                    }`}
                  >
                    {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                  </div>

                  {/* Days Badge */}
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                      isDelayed
                        ? "bg-rose-100 text-rose-900 border border-rose-300"
                        : isCurrent
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : "bg-stone-100 text-stone-500"
                    }`}
                  >
                    {dwellDays}d
                  </span>
                </div>

                {/* Stage Names */}
                <div>
                  <div
                    className={`font-bold text-xs leading-tight mb-0.5 ${
                      isCurrent ? "text-stone-900" : isPassed ? "text-stone-800" : "text-stone-500"
                    }`}
                  >
                    {stage.label}
                  </div>
                  <div className="text-[10px] text-stone-500 font-hindi leading-tight">{stage.hindi}</div>
                </div>

                {/* Delay Warning if applicable */}
                {isDelayed && (
                  <div className="mt-2 flex items-center space-x-1 text-[10px] text-rose-800 font-semibold bg-rose-50 p-1 rounded-lg border border-rose-200">
                    <AlertTriangle className="w-3 h-3 flex-shrink-0 text-rose-600" />
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

