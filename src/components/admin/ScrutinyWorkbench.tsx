"use client";

import React, { useState } from "react";
import { Application, ApplicationStatus } from "@/types";
import { useSetu } from "@/context/SetuContext";
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  UserCheck,
  FileCode,
  FileText,
  ChevronRight,
  Sparkles,
  RotateCcw,
  X,
} from "lucide-react";

export const ScrutinyWorkbench: React.FC = () => {
  const { applications, updateApplicationStatus, applyHumanOverride } = useSetu();

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [schemeFilter, setSchemeFilter] = useState<string>("ALL");
  const [stateFilter, setStateFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedAppModal, setSelectedAppModal] = useState<Application | null>(null);

  // Human Override Modal State
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");
  const [overrideNewStatus, setOverrideNewStatus] = useState<ApplicationStatus>("EligibilityVerification");
  const [overrideNewScore, setOverrideNewScore] = useState<number>(85);

  const states = Array.from(new Set(applications.map((a) => a.state)));

  // Filtered List
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.institute.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesScheme = schemeFilter === "ALL" || app.schemeCode === schemeFilter;
    const matchesState = stateFilter === "ALL" || app.state === stateFilter;
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;

    return matchesSearch && matchesScheme && matchesState && matchesStatus;
  });

  const handleApplyOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppModal || !overrideReason) return;

    applyHumanOverride(selectedAppModal.id, {
      overriddenBy: "Dr. Ramesh Verma (MoTA Joint Secretary)",
      reason: overrideReason,
      newStatus: overrideNewStatus,
      newScore: overrideNewScore,
    });

    setShowOverrideModal(false);
    setSelectedAppModal(null);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Master Application Scrutiny Workbench</span>
            <span className="text-xs bg-amber-500/20 text-amber-300 font-mono px-2.5 py-0.5 rounded-full border border-amber-500/30">
              {filteredApps.length} Applications Filtered
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Inspect OCR JSON findings, evaluate deterministic rule scores, and execute human-in-the-loop decisions.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search candidate, App # or institute..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Scheme Filter */}
        <div>
          <select
            value={schemeFilter}
            onChange={(e) => setSchemeFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Schemes</option>
            <option value="NFST">NFST Fellowship</option>
            <option value="NOS">NOS Overseas</option>
            <option value="PreMatric">Pre-Matric</option>
            <option value="PostMatric">Post-Matric</option>
          </select>
        </div>

        {/* State Filter */}
        <div>
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All States</option>
            {states.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Lifecycle Stages</option>
            <option value="Submitted">Submitted</option>
            <option value="DocumentScrutiny">Document Scrutiny</option>
            <option value="EligibilityVerification">Eligibility Verification</option>
            <option value="Screening">Screening</option>
            <option value="Selection">Selection</option>
            <option value="FinalDecision">Final Decision</option>
          </select>
        </div>
      </div>

      {/* Applications Master Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="p-3.5">Candidate / App #</th>
              <th className="p-3.5">Scheme & State</th>
              <th className="p-3.5">Stage & Dwell</th>
              <th className="p-3.5">Score</th>
              <th className="p-3.5">Document OCR</th>
              <th className="p-3.5 text-right">Human Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredApps.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No applications matched the filter parameters.
                </td>
              </tr>
            ) : (
              filteredApps.map((app) => {
                const hasDeficiency = app.documents.some((d) => d.verificationStatus === "NeedsReview");
                return (
                  <tr key={app.id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-200 text-sm">{app.studentName}</div>
                      <div className="text-[11px] text-amber-400 font-mono">{app.applicationNumber}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-xs">{app.institute}</div>
                    </td>

                    <td className="p-3.5">
                      <span className="font-bold text-slate-200 block">{app.schemeCode}</span>
                      <span className="text-slate-400 text-[11px] font-mono">{app.state}</span>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full inline-block mb-1 ${
                          app.status === "FinalDecision"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : hasDeficiency
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse"
                            : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        }`}
                      >
                        {app.status}
                      </span>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Dwell: {app.stageDwellTimes[app.status] || 1}d
                      </div>
                    </td>

                    <td className="p-3.5 font-mono">
                      <span
                        className={`font-black text-sm ${
                          app.aiScore >= 75
                            ? "text-emerald-400"
                            : app.aiScore >= 50
                            ? "text-amber-400"
                            : "text-rose-400"
                        }`}
                      >
                        {app.aiScore}/100
                      </span>
                      {app.humanOverride && (
                        <span className="block text-[9px] text-amber-300 font-bold uppercase">Human Overridden</span>
                      )}
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center space-x-1">
                        <span className="text-[11px] text-slate-300">
                          {app.documents.filter((d) => d.verificationStatus === "Available").length}/
                          {app.documents.length} Verified
                        </span>
                        {hasDeficiency && (
                          <span className="text-rose-400 font-bold text-[10px] flex items-center gap-0.5">
                            <AlertTriangle className="w-3 h-3" /> Flagged
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedAppModal(app)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>Inspect & Decide</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Deep-Dive Application Modal */}
      {selectedAppModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 text-slate-100 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-6 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedAppModal(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-slate-800 mb-6">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-mono bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    {selectedAppModal.applicationNumber}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{selectedAppModal.state}</span>
                </div>
                <h3 className="text-2xl font-black text-white">{selectedAppModal.studentName}</h3>
                <p className="text-xs text-slate-400">{selectedAppModal.institute}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowOverrideModal(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-sm"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Human Override Decision</span>
                </button>
              </div>
            </div>

            {/* Grid Layout: Rule Score Breakdown & Document OCR Inspector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Glass-Box Scoring Breakdown */}
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-amber-300">
                      Deterministic Glass-Box Eligibility Score
                    </h4>
                    <span className="text-xl font-black text-amber-400 font-mono">
                      {selectedAppModal.aiScore}/100
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    {selectedAppModal.aiScoreReasoning.summary}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                    Rule-by-Rule Audit Trail
                  </h4>
                  {selectedAppModal.aiScoreReasoning.scoreBreakdown.map((rule, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs space-y-1 ${
                        rule.status === "Passed"
                          ? "bg-slate-950 border-emerald-900/60"
                          : "bg-slate-950 border-rose-900/60"
                      }`}
                    >
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-slate-200">{rule.rule}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            rule.status === "Passed"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-rose-500/20 text-rose-300"
                          }`}
                        >
                          {rule.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight">{rule.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: OCR Document Extracted JSON Findings */}
              <div className="space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <span>Puter.js AI Extracted Structured OCR Schema</span>
                </h4>

                <div className="space-y-3">
                  {selectedAppModal.documents.map((doc) => (
                    <div key={doc.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-200 text-xs">{doc.type}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            doc.verificationStatus === "Available"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-rose-500/20 text-rose-300"
                          }`}
                        >
                          {doc.verificationStatus}
                        </span>
                      </div>

                      {/* OCR Extracted JSON Box */}
                      <pre className="bg-slate-900 p-3 rounded-xl border border-slate-800/80 text-[10px] text-emerald-300 font-mono overflow-x-auto leading-relaxed">
                        {JSON.stringify(doc.ocrExtractedFields, null, 2)}
                      </pre>

                      {doc.deficiencyReason && (
                        <div className="text-[11px] text-rose-300 bg-rose-950/40 p-2 rounded border border-rose-900">
                          <strong>Deficiency:</strong> {doc.deficiencyReason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stage Progression Bar */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap justify-between items-center gap-3">
              <span className="text-xs text-slate-400 font-bold">Progress Application Lifecycle Stage:</span>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    updateApplicationStatus(selectedAppModal.id, "EligibilityVerification");
                    setSelectedAppModal(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                >
                  Verify Eligibility
                </button>
                <button
                  onClick={() => {
                    updateApplicationStatus(selectedAppModal.id, "Screening");
                    setSelectedAppModal(null);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                >
                  Shortlist for Screening
                </button>
                <button
                  onClick={() => {
                    updateApplicationStatus(selectedAppModal.id, "FinalDecision");
                    setSelectedAppModal(null);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs"
                >
                  Approve Final Sanction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Human Override Action Modal */}
      {showOverrideModal && selectedAppModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-slate-100">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setShowOverrideModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-white mb-2 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-400" />
              <span>Human Override Audit Entry</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Overriding candidate decision will log officer credentials, timestamp, and justification for audit transparency.
            </p>

            <form onSubmit={handleApplyOverride} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-300">Target Stage</label>
                <select
                  value={overrideNewStatus}
                  onChange={(e) => setOverrideNewStatus(e.target.value as ApplicationStatus)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="EligibilityVerification">Eligibility Verification</option>
                  <option value="Screening">Screening / Shortlist</option>
                  <option value="Selection">Selection Committee</option>
                  <option value="FinalDecision">Final Sanction Approved</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-300">Revised Score (0-100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={overrideNewScore}
                  onChange={(e) => setOverrideNewScore(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-300">Mandatory Override Justification *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="State official reason for human intervention (e.g. Physical document verified at State Office)..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(false)}
                  className="bg-slate-800 text-slate-300 font-bold px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2 rounded-lg"
                >
                  Commit Human Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
