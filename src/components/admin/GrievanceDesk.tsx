"use client";

import React, { useState } from "react";
import { Grievance } from "@/types";
import { useSetu } from "@/context/SetuContext";
import { AlertCircle, Clock, CheckCircle2, ShieldAlert, Send, HelpCircle, X } from "lucide-react";

export const GrievanceDesk: React.FC = () => {
  const { grievances, resolveGrievance } = useSetu();
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGrievance || !resolutionNotes) return;

    resolveGrievance(selectedGrievance.id, resolutionNotes);
    setSelectedGrievance(null);
    setResolutionNotes("");
  };

  return (
    <div className="bg-white border border-[#E7E2D7] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 text-[#1C1917]">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 pb-5 border-b border-[#E7E2D7]">
        <div>
          <h3 className="text-2xl sm:text-3xl font-display font-medium text-[#1C1917] flex items-center gap-3 tracking-tight">
            <HelpCircle className="w-6 h-6 text-[#C58B2B]" />
            <span>Grievance SLA Escalation Desk</span>
            <span className="text-xs bg-rose-50 text-rose-900 font-mono px-3 py-1 rounded-full border border-rose-300 font-semibold">
              7-Day Guaranteed SLA
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Automated scheduled SLA monitor auto-escalates unhandled student grievances from Nodal Officer to Joint Secretary.
          </p>
        </div>
      </div>

      {/* Grievances Master Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {grievances.length === 0 ? (
          <div className="md:col-span-2 p-10 text-center text-xs text-stone-500 bg-[#FAF8F3] rounded-2xl border border-[#E7E2D7]">
            No active grievances registered.
          </div>
        ) : (
          grievances.map((g) => {
            const isResolved = g.status === "Resolved";
            const deadlineTime = new Date(g.slaDeadline).getTime();
            const now = Date.now();
            const isBreached = !isResolved && now > deadlineTime;
            const diffDays = Math.abs(Math.round((now - deadlineTime) / (1000 * 60 * 60 * 24)));

            return (
              <div
                key={g.id}
                className={`p-6 rounded-2xl border transition-all duration-200 space-y-4 relative ${
                  isResolved
                    ? "bg-[#FAF8F3] border-emerald-300 opacity-90"
                    : isBreached
                    ? "bg-rose-50/80 border-rose-300 shadow-sm"
                    : "bg-[#FAF8F3] border-[#E7E2D7] hover:border-stone-400"
                }`}
              >
                {/* Header Row */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-[#C58B2B] font-bold tracking-wider">{g.applicationNumber}</span>
                    <h4 className="font-display font-semibold text-base text-stone-900 mt-0.5">{g.studentName}</h4>
                  </div>

                  {/* Escalation Level Badge */}
                  <span
                    className={`text-[10px] font-bold px-3 py-1 rounded-full border font-mono tracking-wide ${
                      g.escalationLevel === 3
                        ? "bg-rose-600 text-white border-rose-700 font-extrabold animate-pulse"
                        : g.escalationLevel === 2
                        ? "bg-amber-600 text-white border-amber-700 font-bold"
                        : "bg-indigo-50 text-indigo-900 border-indigo-200"
                    }`}
                  >
                    Level {g.escalationLevel}:{" "}
                    {g.escalationLevel === 3
                      ? "Joint Sec Escalation"
                      : g.escalationLevel === 2
                      ? "State Director Escalation"
                      : "Nodal Officer Desk"}
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#E7E2D7] text-xs space-y-1">
                  <div className="font-semibold text-stone-900">{g.subject}</div>
                  <p className="text-stone-600 text-xs leading-relaxed">{g.description}</p>
                </div>

                {/* SLA Status Pill */}
                <div className="flex justify-between items-center text-xs pt-2 border-t border-[#E7E2D7]">
                  <div className="flex items-center space-x-1.5 font-mono">
                    <Clock className="w-3.5 h-3.5 text-[#C58B2B]" />
                    {isResolved ? (
                      <span className="text-emerald-800 font-semibold">Resolved</span>
                    ) : isBreached ? (
                      <span className="text-rose-700 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> SLA Breached by {diffDays}d
                      </span>
                    ) : (
                      <span className="text-[#C58B2B] font-semibold">{diffDays} Days SLA Remaining</span>
                    )}
                  </div>

                  {!isResolved && (
                    <button
                      onClick={() => setSelectedGrievance(g)}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition-all transform active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </button>
                  )}
                </div>

                {g.resolutionNotes && (
                  <div className="text-[11px] text-emerald-900 bg-emerald-50 p-3 rounded-xl border border-emerald-300">
                    <strong className="text-emerald-950">Resolution Notes:</strong> {g.resolutionNotes}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Resolution Modal */}
      {selectedGrievance && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 text-[#1C1917]">
          <div className="bg-white border border-[#E7E2D7] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <button onClick={() => setSelectedGrievance(null)} className="absolute top-6 right-6 text-stone-400 hover:text-stone-800 transition-colors">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-semibold text-xl text-[#1C1917] mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <span>Resolve Student Grievance</span>
            </h3>

            <form onSubmit={handleResolve} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium mb-1.5 text-stone-700">Grievance Subject</label>
                <input
                  type="text"
                  disabled
                  value={selectedGrievance.subject}
                  className="w-full bg-[#FAF8F3] border border-[#E7E2D7] rounded-xl px-3.5 py-2.5 text-stone-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-medium mb-1.5 text-stone-700">Official Resolution Action &amp; Notes *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="State resolution details (e.g., Application document scrutiny cleared at State office)..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#E7E2D7] rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-[#C58B2B]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-[#E7E2D7]">
                <button
                  type="button"
                  onClick={() => setSelectedGrievance(null)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold px-4 py-2.5 rounded-xl transition-colors border border-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl flex items-center space-x-1.5 shadow-md transition-all transform active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Resolution</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

