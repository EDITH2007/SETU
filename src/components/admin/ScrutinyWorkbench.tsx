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
    <div className="bg-white border border-[#E7E2D7] rounded-3xl p-6 shadow-xl space-y-6 text-[#1C1917]">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-[#E7E2D7]">
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1C1917] flex items-center gap-2">
            <span>Master Application Scrutiny Workbench</span>
            <span className="text-xs bg-amber-100 text-amber-900 font-mono px-3 py-0.5 rounded-full border border-amber-300">
              {filteredApps.length} Applications Filtered
            </span>
          </h3>
          <p className="text-xs text-stone-600 mt-0.5">
            Inspect OCR JSON findings, evaluate deterministic rule scores, and execute human-in-the-loop decisions.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-[#FAF8F3] p-4 rounded-2xl border border-[#E7E2D7]">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search candidate, App # or institute..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-[#E7E2D7] rounded-xl pl-9 pr-3.5 py-2 text-stone-900 focus:outline-none focus:border-[#C58B2B] shadow-sm"
          />
        </div>

        {/* Scheme Filter */}
        <div>
          <select
            value={schemeFilter}
            onChange={(e) => setSchemeFilter(e.target.value)}
            className="w-full bg-white border border-[#E7E2D7] rounded-xl px-3.5 py-2 text-stone-800 focus:outline-none focus:border-[#C58B2B] cursor-pointer shadow-sm"
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
            className="w-full bg-white border border-[#E7E2D7] rounded-xl px-3.5 py-2 text-stone-800 focus:outline-none focus:border-[#C58B2B] cursor-pointer shadow-sm"
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
            className="w-full bg-white border border-[#E7E2D7] rounded-xl px-3.5 py-2 text-stone-800 focus:outline-none focus:border-[#C58B2B] cursor-pointer shadow-sm"
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
      <div className="overflow-x-auto rounded-2xl border border-[#E7E2D7] bg-white">
        <table className="w-full text-left text-xs text-stone-700">
          <thead className="bg-[#F0ECE1] text-stone-700 font-bold uppercase text-[10px] tracking-wider border-b border-[#E7E2D7]">
            <tr>
              <th className="p-4">Candidate / App #</th>
              <th className="p-4">Scheme & State</th>
              <th className="p-4">Stage & Dwell</th>
              <th className="p-4">Score</th>
              <th className="p-4">Document OCR</th>
              <th className="p-4 text-right">Human Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E2D7]">
            {filteredApps.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-stone-500">
                  No applications matched the filter parameters.
                </td>
              </tr>
            ) : (
              filteredApps.map((app) => {
                const hasDeficiency = app.documents.some((d) => d.verificationStatus === "NeedsReview");
                return (
                  <tr key={app.id} className="hover:bg-[#FAF8F3] transition-colors">
                    <td className="p-4">
                      <div className="font-display font-bold text-stone-900 text-sm">{app.studentName}</div>
                      <div className="text-[11px] text-[#C58B2B] font-mono">{app.applicationNumber}</div>
                      <div className="text-[10px] text-stone-500 truncate max-w-xs">{app.institute}</div>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-stone-900 block">{app.schemeCode}</span>
                      <span className="text-stone-500 text-[11px] font-mono">{app.state}</span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full inline-block mb-1 ${
                          app.status === "FinalDecision"
                            ? "bg-emerald-50 text-emerald-900 border border-emerald-300"
                            : hasDeficiency
                            ? "bg-rose-50 text-rose-900 border border-rose-300 animate-pulse"
                            : "bg-indigo-50 text-indigo-900 border border-indigo-200"
                        }`}
                      >
                        {app.status}
                      </span>
                      <div className="text-[10px] text-stone-500 font-mono">
                        Dwell: {app.stageDwellTimes[app.status] || 1}d
                      </div>
                    </td>

                    <td className="p-4 font-mono">
                      <span
                        className={`font-black text-sm ${
                          app.aiScore >= 75
                            ? "text-emerald-700"
                            : app.aiScore >= 50
                            ? "text-amber-700"
                            : "text-rose-700"
                        }`}
                      >
                        {app.aiScore}/100
                      </span>
                      {app.humanOverride && (
                        <span className="block text-[9px] text-[#C58B2B] font-bold uppercase tracking-wider">Human Overridden</span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[11px] text-stone-700 font-mono">
                          {app.documents.filter((d) => d.verificationStatus === "Available").length}/
                          {app.documents.length} Verified
                        </span>
                        {hasDeficiency && (
                          <span className="text-rose-700 font-bold text-[10px] flex items-center gap-0.5">
                            <AlertTriangle className="w-3 h-3 text-rose-600" /> Flagged
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedAppModal(app)}
                        className="bg-[#FAF8F3] hover:bg-[#F0ECE1] text-stone-800 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 ml-auto transition-colors cursor-pointer border border-[#E7E2D7] shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#C58B2B]" />
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
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-[#1C1917] overflow-y-auto">
          <div className="bg-white border border-[#E7E2D7] rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedAppModal(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-800"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-[#E7E2D7] mb-6">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-mono bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-md border border-amber-300">
                    {selectedAppModal.applicationNumber}
                  </span>
                  <span className="text-xs text-stone-500 font-mono">{selectedAppModal.state}</span>
                </div>
                <h3 className="font-display text-2xl font-black text-[#1C1917]">{selectedAppModal.studentName}</h3>
                <p className="text-xs text-stone-500">{selectedAppModal.institute}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowOverrideModal(true)}
                  className="bg-[#1E2B37] hover:bg-[#2C3B4E] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-md cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  <span>Human Override Decision</span>
                </button>
              </div>
            </div>

            {/* Grid Layout: Rule Score Breakdown & Document OCR Inspector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Glass-Box Scoring Breakdown */}
              <div className="space-y-4">
                <div className="bg-[#FAF8F3] p-4.5 rounded-2xl border border-[#E7E2D7] space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-[#C58B2B]">
                      Deterministic Glass-Box Eligibility Score
                    </h4>
                    <span className="text-2xl font-black text-[#1C1917] font-mono">
                      {selectedAppModal.aiScore}/100
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed bg-white p-3 rounded-xl border border-[#E7E2D7]">
                    {selectedAppModal.aiScoreReasoning.summary}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500">
                    Rule-by-Rule Audit Trail
                  </h4>
                  {selectedAppModal.aiScoreReasoning.scoreBreakdown.map((rule, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                        rule.status === "Passed"
                          ? "bg-emerald-50/60 border-emerald-200"
                          : "bg-rose-50/60 border-rose-200"
                      }`}
                    >
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-stone-900">{rule.rule}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            rule.status === "Passed"
                              ? "bg-emerald-100 text-emerald-900"
                              : "bg-rose-100 text-rose-900"
                          }`}
                        >
                          {rule.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-tight">{rule.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: OCR Document Extracted JSON Findings */}
              <div className="space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-emerald-700" />
                  <span>Puter.js AI Extracted Structured OCR Schema</span>
                </h4>

                <div className="space-y-3">
                  {selectedAppModal.documents.map((doc) => (
                    <div key={doc.id} className="bg-[#FAF8F3] p-4 rounded-2xl border border-[#E7E2D7] space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-stone-900 text-xs">{doc.type}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            doc.verificationStatus === "Available"
                              ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                              : "bg-rose-100 text-rose-900 border border-rose-300"
                          }`}
                        >
                          {doc.verificationStatus}
                        </span>
                      </div>

                      {/* OCR Extracted JSON Box */}
                      <pre className="bg-[#1C1917] p-3 rounded-xl border border-stone-700 text-[10px] text-emerald-400 font-mono overflow-x-auto leading-relaxed shadow-inner">
                        {JSON.stringify(doc.ocrExtractedFields, null, 2)}
                      </pre>

                      {doc.deficiencyReason && (
                        <div className="text-[11px] text-rose-900 bg-rose-100 p-2.5 rounded-xl border border-rose-300">
                          <strong>Deficiency:</strong> {doc.deficiencyReason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stage Progression Bar */}
            <div className="mt-6 pt-4 border-t border-[#E7E2D7] flex flex-wrap justify-between items-center gap-3">
              <span className="text-xs text-stone-600 font-bold">Progress Application Lifecycle Stage:</span>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    updateApplicationStatus(selectedAppModal.id, "EligibilityVerification");
                    setSelectedAppModal(null);
                  }}
                  className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-3.5 py-2 rounded-xl text-xs cursor-pointer shadow-sm"
                >
                  Verify Eligibility
                </button>
                <button
                  onClick={() => {
                    updateApplicationStatus(selectedAppModal.id, "Screening");
                    setSelectedAppModal(null);
                  }}
                  className="bg-[#1E2B37] hover:bg-[#2C3B4E] text-white font-bold px-3.5 py-2 rounded-xl text-xs cursor-pointer shadow-sm"
                >
                  Shortlist for Screening
                </button>
                <button
                  onClick={() => {
                    updateApplicationStatus(selectedAppModal.id, "FinalDecision");
                    setSelectedAppModal(null);
                  }}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-md"
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
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-[#1C1917]">
          <div className="bg-white border border-[#E7E2D7] rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setShowOverrideModal(false)} className="absolute top-5 right-5 text-stone-400 hover:text-stone-800">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-lg text-[#1C1917] mb-2 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#C58B2B]" />
              <span>Human Override Audit Entry</span>
            </h3>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Overriding candidate decision will log officer credentials, timestamp, and justification for audit transparency.
            </p>

            <form onSubmit={handleApplyOverride} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-stone-700">Target Stage</label>
                <select
                  value={overrideNewStatus}
                  onChange={(e) => setOverrideNewStatus(e.target.value as ApplicationStatus)}
                  className="w-full bg-[#FAF8F3] border border-[#E7E2D7] rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:border-[#C58B2B]"
                >
                  <option value="EligibilityVerification">Eligibility Verification</option>
                  <option value="Screening">Screening / Shortlist</option>
                  <option value="Selection">Selection Committee</option>
                  <option value="FinalDecision">Final Sanction Approved</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700">Revised Score (0-100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={overrideNewScore}
                  onChange={(e) => setOverrideNewScore(Number(e.target.value))}
                  className="w-full bg-[#FAF8F3] border border-[#E7E2D7] rounded-xl px-3 py-2 text-stone-900 font-mono focus:outline-none focus:border-[#C58B2B]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700">Mandatory Override Justification *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="State official reason for human intervention (e.g. Physical document verified at State Office)..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full bg-[#FAF8F3] border border-[#E7E2D7] rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-[#C58B2B]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(false)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold px-4 py-2 rounded-xl border border-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1E2B37] hover:bg-[#2C3B4E] text-white font-bold px-5 py-2 rounded-xl shadow-md cursor-pointer"
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


