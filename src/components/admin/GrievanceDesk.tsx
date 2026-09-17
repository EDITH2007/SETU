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
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <span>Grievance SLA Escalation Desk</span>
            <span className="text-xs bg-rose-500/20 text-rose-300 font-mono px-2.5 py-0.5 rounded-full border border-rose-500/30 font-bold">
              7-Day Guaranteed SLA
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Automated scheduled SLA monitor auto-escalates unhandled student grievances from Nodal Officer to Joint Secretary.
          </p>
        </div>
      </div>

      {/* Grievances Master Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {grievances.length === 0 ? (
          <div className="md:col-span-2 p-8 text-center text-xs text-slate-500 bg-slate-950 rounded-2xl border border-slate-800">
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
                className={`p-5 rounded-2xl border transition-all space-y-3 relative ${
                  isResolved
                    ? "bg-slate-950 border-emerald-900/60 opacity-80"
                    : isBreached
                    ? "bg-rose-950/30 border-rose-800 shadow-xl shadow-rose-950/20"
                    : "bg-slate-950 border-slate-800"
                }`}
              >
                {/* Header Row */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-amber-300 font-bold">{g.applicationNumber}</span>
                    <h4 className="font-bold text-sm text-slate-200 mt-0.5">{g.studentName}</h4>
                  </div>

                  {/* Escalation Level Badge */}
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border font-mono ${
                      g.escalationLevel === 3
                        ? "bg-rose-600 text-slate-950 border-rose-400 font-black animate-bounce"
                        : g.escalationLevel === 2
                        ? "bg-amber-500 text-slate-950 border-amber-400 font-black"
                        : "bg-blue-500/20 text-blue-300 border-blue-500/40"
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

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="font-bold text-slate-200">{g.subject}</div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{g.description}</p>
                </div>

                {/* SLA Status Pill */}
                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800/80">
                  <div className="flex items-center space-x-1.5 font-mono">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {isResolved ? (
                      <span className="text-emerald-400 font-bold">Resolved</span>
                    ) : isBreached ? (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> SLA Breached by {diffDays}d
                      </span>
                    ) : (
                      <span className="text-amber-300 font-bold">{diffDays} Days SLA Remaining</span>
                    )}
                  </div>

                  {!isResolved && (
                    <button
                      onClick={() => setSelectedGrievance(g)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </button>
                  )}
                </div>

                {g.resolutionNotes && (
                  <div className="text-[11px] text-emerald-300 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-900/60">
                    <strong>Resolution Notes:</strong> {g.resolutionNotes}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Resolution Modal */}
      {selectedGrievance && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-slate-100">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setSelectedGrievance(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-white mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Resolve Student Grievance</span>
            </h3>

            <form onSubmit={handleResolve} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-300">Grievance Subject</label>
                <input
                  type="text"
                  disabled
                  value={selectedGrievance.subject}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-400"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-300">Official Resolution Action & Notes *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="State resolution details (e.g., Application document scrutiny cleared at State office)..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedGrievance(null)}
                  className="bg-slate-800 text-slate-300 font-bold px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-5 py-2 rounded-lg flex items-center space-x-1"
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
