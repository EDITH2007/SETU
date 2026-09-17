"use client";

import React, { useState } from "react";
import { useSetu } from "@/context/SetuContext";
import { StatusTimeline } from "./StatusTimeline";
import { DeficiencyCard } from "./DeficiencyCard";
import { ApplicationWizard } from "./ApplicationWizard";
import { SimulatedAdapterBadge } from "@/components/common/SimulatedAdapterBadge";
import {
  PlusCircle,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  ChevronRight,
  Send,
  Building,
  GraduationCap,
  ShieldCheck,
  X,
} from "lucide-react";

export const ApplicantPortal: React.FC = () => {
  const { applications, schemes, grievances, raiseGrievance } = useSetu();
  const [showWizard, setShowWizard] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(applications[0]?.id || null);
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [grievanceSubject, setGrievanceSubject] = useState("");
  const [grievanceDesc, setGrievanceDesc] = useState("");
  const [grievanceSubmitted, setGrievanceSubmitted] = useState(false);

  const selectedApp = applications.find((a) => a.id === selectedAppId) || applications[0];

  const handleFileGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !grievanceSubject || !grievanceDesc) return;

    raiseGrievance(selectedApp.id, grievanceSubject, grievanceDesc);
    setGrievanceSubmitted(true);
    setTimeout(() => {
      setGrievanceSubmitted(false);
      setShowGrievanceModal(false);
      setGrievanceSubject("");
      setGrievanceDesc("");
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-slate-100">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0F2C59] via-[#1E3E62] to-[#0A1E3F] rounded-3xl p-6 sm:p-8 border border-blue-900/60 shadow-2xl flex flex-wrap justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 text-xs px-3 py-1 rounded-full border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ministry of Tribal Affairs Student Dashboard</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome to SETU Portal <span className="font-hindi text-amber-400 font-normal">(सेतु)</span>
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Track your National Fellowship (NFST), Overseas Scholarship (NOS), or Pre/Post-Matric applications with Puter.js AI document verification and 100% transparent stage tracking.
          </p>

          <div className="pt-2 flex flex-wrap gap-2">
            <SimulatedAdapterBadge
              systemName="DigiLocker"
              description="Automated caste and income certificate verification"
            />
            <SimulatedAdapterBadge
              systemName="PFMS / Direct Benefit Transfer (DBT)"
              description="Direct stipend credit to Aadhaar-seeded bank account"
            />
          </div>
        </div>

        <button
          onClick={() => setShowWizard(true)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-xs sm:text-sm flex items-center space-x-2 shadow-xl hover:shadow-amber-500/20 transition-all cursor-pointer border border-amber-400/40 relative z-10"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Apply for New Scholarship</span>
        </button>
      </div>

      {/* Grid Layout: App List & Detailed Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Applications Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Your Applications ({applications.length})</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Live Sync</span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {applications.slice(0, 8).map((app) => {
              const isSelected = app.id === selectedApp?.id;
              const hasDeficiency = app.documents.some((d) => d.verificationStatus === "NeedsReview");

              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-slate-900 border-amber-500 ring-1 ring-amber-500 shadow-xl"
                      : "bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-xs font-mono text-amber-300">{app.applicationNumber}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        app.status === "FinalDecision"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : hasDeficiency
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse"
                          : "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-200 mb-1">{app.schemeCode} Scheme</h4>
                  <div className="text-xs text-slate-400 font-mono mb-2">{app.institute}</div>

                  <div className="flex justify-between items-center text-[11px] pt-2 border-t border-slate-800/80 text-slate-400">
                    <span>Score: <strong className="text-amber-300">{app.aiScore}/100</strong></span>
                    {hasDeficiency && (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Deficiency Flagged
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Schemes Overview Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Available Schemes</h4>
            {schemes.map((s) => (
              <div key={s.id} className="text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-slate-200">{s.name}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  Ceiling: ₹{(s.eligibilityRules.incomeCeiling / 100000).toFixed(1)} LPA • {s.disbursementFrequency}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Selected Application Detail View (8 cols) */}
        {selectedApp ? (
          <div className="lg:col-span-8 space-y-6">
            {/* Header Detail Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-mono bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-md border border-amber-500/30">
                      {selectedApp.applicationNumber}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{selectedApp.state} State</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{selectedApp.studentName}</h3>
                  <p className="text-xs text-slate-400">{selectedApp.institute}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Deterministic Score</div>
                    <div className="text-xl font-black text-amber-400 font-mono">{selectedApp.aiScore}/100</div>
                  </div>

                  <button
                    onClick={() => setShowGrievanceModal(true)}
                    className="bg-rose-900/40 hover:bg-rose-900/80 text-rose-300 border border-rose-700/60 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center space-x-1.5 transition-all"
                  >
                    <HelpCircle className="w-4 h-4 text-rose-400" />
                    <span>Raise Grievance</span>
                  </button>
                </div>
              </div>

              {/* Stat Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Annual Income</span>
                  <span className="font-bold text-slate-200 font-mono">
                    ₹{selectedApp.incomeAmount.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Academic Marks</span>
                  <span className="font-bold text-slate-200 font-mono">{selectedApp.marksPercent}%</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Category</span>
                  <span className="font-bold text-amber-300 font-mono">{selectedApp.category}</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Submitted On</span>
                  <span className="font-bold text-slate-200 font-mono">
                    {new Date(selectedApp.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Official 7-Stage Timeline Component */}
            <StatusTimeline
              currentStatus={selectedApp.status}
              stageDwellTimes={selectedApp.stageDwellTimes}
              stageEnteredAt={selectedApp.stageEnteredAt}
            />

            {/* Document Deficiencies Section (If Any) */}
            {selectedApp.documents.some((d) => d.verificationStatus === "NeedsReview" || d.verificationStatus === "Missing") && (
              <div className="space-y-4">
                <h3 className="font-bold text-base text-rose-400 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  <span>Action Required: Document Deficiencies</span>
                </h3>

                {selectedApp.documents
                  .filter((d) => d.verificationStatus === "NeedsReview" || d.verificationStatus === "Missing")
                  .map((doc) => (
                    <DeficiencyCard key={doc.id} applicationId={selectedApp.id} document={doc} />
                  ))}
              </div>
            )}

            {/* Human Override Banner if present */}
            {selectedApp.humanOverride && (
              <div className="bg-amber-950/40 border border-amber-700/80 rounded-2xl p-4 text-xs space-y-1">
                <div className="font-bold text-amber-300 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Human Oversight Audit Trail</span>
                </div>
                <p className="text-slate-300">
                  <strong>Officer:</strong> {selectedApp.humanOverride.overriddenBy} •{" "}
                  <strong>Reason:</strong> {selectedApp.humanOverride.reason}
                </p>
              </div>
            )}

            {/* Extracted Document Inventory */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h4 className="font-bold text-sm text-white">Uploaded Statutory Documents ({selectedApp.documents.length})</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {selectedApp.documents.map((doc) => (
                  <div key={doc.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-200">{doc.type}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          doc.verificationStatus === "Available"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        {doc.verificationStatus}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono truncate">{doc.fileName}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
            Select an application from the left panel to inspect details.
          </div>
        )}
      </div>

      {/* Application Wizard Modal */}
      {showWizard && (
        <ApplicationWizard
          onClose={() => setShowWizard(false)}
          onSuccess={(appId) => {
            setShowWizard(false);
            setSelectedAppId(appId);
          }}
        />
      )}

      {/* Raise Grievance Modal */}
      {showGrievanceModal && selectedApp && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-slate-100">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowGrievanceModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-white mb-1 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-rose-400" />
              <span>Raise Official Grievance</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Guaranteed SLA deadline: 7 days. Automatic escalation to State Director & MoTA Joint Secretary if unhandled.
            </p>

            {grievanceSubmitted ? (
              <div className="bg-emerald-950 border border-emerald-700 text-emerald-300 p-4 rounded-xl text-xs text-center font-bold">
                Grievance filed successfully! SLA timer (7 Days) initialized.
              </div>
            ) : (
              <form onSubmit={handleFileGrievance} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Application Number</label>
                  <input
                    type="text"
                    disabled
                    value={selectedApp.applicationNumber}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Grievance Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Application pending in Document Scrutiny >10 days"
                    value={grievanceSubject}
                    onChange={(e) => setGrievanceSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-300">Detailed Description *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your issue in detail..."
                    value={grievanceDesc}
                    onChange={(e) => setGrievanceDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowGrievanceModal(false)}
                    className="bg-slate-800 text-slate-300 font-bold px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-5 py-2 rounded-lg flex items-center space-x-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>File Grievance</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
