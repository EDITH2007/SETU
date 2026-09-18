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
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8 text-stone-900">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E7E2D7] shadow-md flex flex-wrap justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2.5 max-w-2xl relative z-10">
          <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-900 text-xs px-3 py-1 rounded-full border border-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-[#C58B2B]" />
            <span>Ministry of Tribal Affairs Student Dashboard</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Welcome to SETU Portal <span className="font-hindi text-[#C58B2B] font-normal">(सेतु)</span>
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-sans">
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
          className="w-full sm:w-auto bg-[#1E2B37] hover:bg-[#121B24] text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer relative z-10"
        >
          <PlusCircle className="w-5 h-5 text-amber-400" />
          <span>Apply for New Scholarship</span>
        </button>
      </div>

      {/* Responsive Grid Layout: App List & Detailed Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Applications Selector (4 cols desktop, full width mobile) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-display font-bold text-base text-stone-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#C58B2B]" />
              <span>Your Applications ({applications.length})</span>
            </h3>
            <span className="text-[11px] text-stone-500 font-mono">Live Sync</span>
          </div>

          <div className="space-y-3 max-h-[500px] sm:max-h-[600px] overflow-y-auto pr-1">
            {applications.slice(0, 8).map((app) => {
              const isSelected = app.id === selectedApp?.id;
              const hasDeficiency = app.documents.some((d) => d.verificationStatus === "NeedsReview");

              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all hover:-translate-y-0.5 ${
                    isSelected
                      ? "bg-amber-50/70 border-[#C58B2B] ring-1 ring-[#C58B2B]/40 shadow-sm"
                      : "bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/50 shadow-xs"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-xs font-mono text-[#C58B2B]">{app.applicationNumber}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        app.status === "FinalDecision"
                          ? "bg-emerald-50 text-emerald-900 border border-emerald-300"
                          : hasDeficiency
                          ? "bg-rose-50 text-rose-900 border border-rose-300 animate-pulse"
                          : "bg-indigo-50 text-indigo-900 border border-indigo-200"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-sm text-stone-900 mb-1">{app.schemeCode} Scheme</h4>
                  <div className="text-xs text-stone-600 font-mono mb-2 truncate">{app.institute}</div>

                  <div className="flex justify-between items-center text-[11px] pt-2 border-t border-stone-100 text-stone-500">
                    <span>Score: <strong className="text-[#C58B2B] font-mono">{app.aiScore}/100</strong></span>
                    {hasDeficiency && (
                      <span className="text-rose-700 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Deficiency
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Schemes Overview Widget */}
          <div className="bg-white border border-[#E7E2D7] rounded-2xl p-4 space-y-3 shadow-xs">
            <h4 className="font-bold text-xs uppercase tracking-wider text-stone-600">Available Schemes</h4>
            <div className="space-y-2">
              {schemes.map((s) => (
                <div key={s.id} className="text-xs p-3 rounded-xl bg-[#FAF8F5] border border-stone-200">
                  <div className="font-bold text-stone-900">{s.name}</div>
                  <div className="text-[11px] text-stone-600 font-mono mt-1">
                    Ceiling: ₹{(s.eligibilityRules.incomeCeiling / 100000).toFixed(1)} LPA • {s.disbursementFrequency}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Application Detail View (8 cols) */}
        {selectedApp ? (
          <div className="lg:col-span-8 space-y-6">
            {/* Header Detail Card */}
            <div className="bg-white border border-[#E7E2D7] rounded-3xl p-5 sm:p-6 shadow-md space-y-4">
              <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-stone-200">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-mono bg-amber-50 text-amber-900 px-2.5 py-0.5 rounded-md border border-amber-300 font-semibold">
                      {selectedApp.applicationNumber}
                    </span>
                    <span className="text-xs text-stone-500 font-mono">{selectedApp.state} State</span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-stone-900">{selectedApp.studentName}</h3>
                  <p className="text-xs text-stone-600">{selectedApp.institute}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-[#FAF8F5] px-4 py-2 rounded-2xl border border-stone-200 text-center shadow-xs">
                    <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Glass-Box Score</div>
                    <div className="text-xl font-black text-[#C58B2B] font-mono">{selectedApp.aiScore}/100</div>
                  </div>

                  <button
                    onClick={() => setShowGrievanceModal(true)}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <HelpCircle className="w-4 h-4 text-rose-700" />
                    <span>Raise Grievance</span>
                  </button>
                </div>
              </div>

              {/* Stat Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block text-[10px]">Annual Income</span>
                  <span className="font-bold text-stone-900 font-mono">
                    ₹{selectedApp.incomeAmount.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block text-[10px]">Academic Marks</span>
                  <span className="font-bold text-stone-900 font-mono">{selectedApp.marksPercent}%</span>
                </div>

                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block text-[10px]">Category</span>
                  <span className="font-bold text-[#C58B2B] font-mono">{selectedApp.category}</span>
                </div>

                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block text-[10px]">Submitted On</span>
                  <span className="font-bold text-stone-900 font-mono">
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
                <h3 className="font-display font-bold text-base text-rose-800 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-700" />
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
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs space-y-1 shadow-xs">
                <div className="font-bold text-amber-900 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C58B2B]" />
                  <span>Human Oversight Audit Trail</span>
                </div>
                <p className="text-stone-700 leading-relaxed">
                  <strong>Officer:</strong> {selectedApp.humanOverride.overriddenBy} •{" "}
                  <strong>Reason:</strong> {selectedApp.humanOverride.reason}
                </p>
              </div>
            )}

            {/* Extracted Document Inventory */}
            <div className="bg-white border border-[#E7E2D7] rounded-3xl p-5 space-y-3 shadow-md">
              <h4 className="font-display font-bold text-sm text-stone-900">Uploaded Statutory Documents ({selectedApp.documents.length})</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {selectedApp.documents.map((doc) => (
                  <div key={doc.id} className="bg-[#FAF8F5] p-3 rounded-xl border border-stone-200 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-stone-900">{doc.type}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          doc.verificationStatus === "Available"
                            ? "bg-emerald-50 text-emerald-900 border border-emerald-300"
                            : "bg-rose-50 text-rose-900 border border-rose-300"
                        }`}
                      >
                        {doc.verificationStatus}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 font-mono truncate">{doc.fileName}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 bg-white border border-[#E7E2D7] rounded-3xl p-12 text-center text-stone-500 shadow-md">
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
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-stone-900">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowGrievanceModal(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-lg text-stone-900 mb-1 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-rose-700" />
              <span>Raise Official Grievance</span>
            </h3>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Guaranteed SLA deadline: 7 days. Automatic escalation to State Director & MoTA Joint Secretary if unhandled.
            </p>

            {grievanceSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl text-xs text-center font-bold">
                Grievance filed successfully! SLA timer (7 Days) initialized.
              </div>
            ) : (
              <form onSubmit={handleFileGrievance} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-stone-700">Application Number</label>
                  <input
                    type="text"
                    disabled
                    value={selectedApp.applicationNumber}
                    className="w-full bg-stone-100 border border-stone-300 rounded-xl px-3 py-2 text-stone-600 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-stone-700">Grievance Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Application pending in Document Scrutiny >10 days"
                    value={grievanceSubject}
                    onChange={(e) => setGrievanceSubject(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-[#1E2B37]"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-stone-700">Detailed Description *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your issue in detail..."
                    value={grievanceDesc}
                    onChange={(e) => setGrievanceDesc(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-[#1E2B37]"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowGrievanceModal(false)}
                    className="bg-stone-100 text-stone-700 hover:bg-stone-200 font-bold px-4 py-2 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-rose-700 hover:bg-rose-800 text-white font-bold px-5 py-2 rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md"
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

