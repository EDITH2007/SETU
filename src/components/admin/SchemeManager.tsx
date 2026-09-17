"use client";

import React, { useState } from "react";
import { Scheme, SchemeType } from "@/types";
import { useSetu } from "@/context/SetuContext";
import { PlusCircle, Edit3, Save, CheckCircle2, ShieldCheck, Sliders, X } from "lucide-react";

export const SchemeManager: React.FC = () => {
  const { schemes, addScheme, updateScheme } = useSetu();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [code, setCode] = useState<SchemeType>("NFST");
  const [totalCorpus, setTotalCorpus] = useState<number>(500000000);
  const [allocatedYears, setAllocatedYears] = useState<number>(5);
  const [incomeCeiling, setIncomeCeiling] = useState<number>(600000);
  const [minMarksPercent, setMinMarksPercent] = useState<number>(55);
  const [ageMax, setAgeMax] = useState<number | undefined>(35);
  const [academicQualification, setAcademicQualification] = useState("Post Graduate Degree with min 55%");
  const [programmeType, setProgrammeType] = useState("M.Phil / Ph.D. Regular Full-Time");
  const [disbursementFrequency, setDisbursementFrequency] = useState<Scheme["disbursementFrequency"]>("Quarterly");
  const [selectedDocs, setSelectedDocs] = useState<string[]>([
    "ST Category Certificate",
    "Annual Income Certificate",
    "Marksheet",
    "Aadhaar Card",
  ]);

  const allAvailableDocs = [
    "ST Category Certificate",
    "Annual Income Certificate",
    "Marksheet",
    "University Admission Letter",
    "Valid Indian Passport",
    "GRE / TOEFL / IELTS Scorecard",
    "Aadhaar Card",
    "Bank Passbook",
    "School Fee Receipt",
  ];

  const handleToggleDoc = (doc: string) => {
    if (selectedDocs.includes(doc)) {
      setSelectedDocs(selectedDocs.filter((d) => d !== doc));
    } else {
      setSelectedDocs([...selectedDocs, doc]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const schemePayload = {
      name,
      code,
      type: code,
      totalCorpus,
      allocatedYears,
      currentYearBudget: Math.round(totalCorpus / allocatedYears),
      eligibilityRules: {
        category: ["ST"],
        ageMax,
        academicQualification,
        minMarksPercent,
        incomeCeiling,
        programmeType,
      },
      requiredDocs: selectedDocs,
      disbursementFrequency,
      applicationWindow: {
        startDate: "2026-01-01",
        endDate: "2026-12-31",
      },
      selectionCriteria: "Deterministic Merit Score & Statutory Income Verification",
      isActive: true,
    };

    if (editingId) {
      updateScheme(editingId, schemePayload);
    } else {
      addScheme(schemePayload);
    }

    setShowForm(false);
    setEditingId(null);
  };

  const startEdit = (s: Scheme) => {
    setEditingId(s.id);
    setName(s.name);
    setCode(s.code);
    setTotalCorpus(s.totalCorpus);
    setAllocatedYears(s.allocatedYears);
    setIncomeCeiling(s.eligibilityRules.incomeCeiling);
    setMinMarksPercent(s.eligibilityRules.minMarksPercent || 50);
    setAgeMax(s.eligibilityRules.ageMax);
    setAcademicQualification(s.eligibilityRules.academicQualification);
    setProgrammeType(s.eligibilityRules.programmeType);
    setDisbursementFrequency(s.disbursementFrequency);
    setSelectedDocs(s.requiredDocs);
    setShowForm(true);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-mono bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-bold flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" />
              <span>No-Code Statutory Form Editor</span>
            </span>
          </div>
          <h3 className="text-xl font-bold text-white">Configurable Scheme & Eligibility Engine</h3>
          <p className="text-xs text-slate-400">
            Define statutory eligibility limits, document checklists, and disbursement rules without touching code.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setName("");
            setShowForm(true);
          }}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Configure New Scheme</span>
        </button>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schemes.map((s) => (
          <div key={s.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 relative">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded font-bold">
                  {s.code}
                </span>
                <h4 className="font-bold text-base text-white mt-1">{s.name}</h4>
              </div>

              <button
                onClick={() => startEdit(s)}
                className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-lg border border-slate-800 transition-colors"
                title="Edit Scheme Rules"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 font-mono bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
              <div>Income Ceiling: ₹{(s.eligibilityRules.incomeCeiling / 100000).toFixed(1)} LPA</div>
              <div>Min Marks: {s.eligibilityRules.minMarksPercent}%</div>
              <div>Corpus: ₹{(s.totalCorpus / 10000000).toFixed(1)} Cr</div>
              <div>Freq: {s.disbursementFrequency}</div>
            </div>

            <div className="text-xs text-slate-400">
              <span className="font-bold text-slate-300 block mb-1">Required Documents ({s.requiredDocs.length}):</span>
              <div className="flex flex-wrap gap-1">
                {s.requiredDocs.map((d) => (
                  <span key={d} className="bg-slate-900 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-800">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Configurator Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-slate-100 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative my-8">
            <button onClick={() => setShowForm(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-white mb-4 pb-2 border-b border-slate-800 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              <span>{editingId ? "Edit Scheme Rule Config" : "Create New Statutory Scheme"}</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Scheme Official Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. National Fellowship for ST Students"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Scheme Short Code *</label>
                  <select
                    value={code}
                    onChange={(e) => setCode(e.target.value as SchemeType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="NFST">NFST</option>
                    <option value="NOS">NOS</option>
                    <option value="PreMatric">PreMatric</option>
                    <option value="PostMatric">PostMatric</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Income Ceiling (₹ Per Annum) *</label>
                  <input
                    type="number"
                    required
                    value={incomeCeiling}
                    onChange={(e) => setIncomeCeiling(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Total Corpus Budget (₹) *</label>
                  <input
                    type="number"
                    required
                    value={totalCorpus}
                    onChange={(e) => setTotalCorpus(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Minimum Marks % *</label>
                  <input
                    type="number"
                    required
                    value={minMarksPercent}
                    onChange={(e) => setMinMarksPercent(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Max Age Limit (Years)</label>
                  <input
                    type="number"
                    value={ageMax || ""}
                    onChange={(e) => setAgeMax(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 35 (Leave empty if no limit)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Disbursement Frequency *</label>
                  <select
                    value={disbursementFrequency}
                    onChange={(e) => setDisbursementFrequency(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Quarterly">Quarterly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
              </div>

              {/* Required Documents Checklist */}
              <div>
                <label className="block font-semibold mb-2 text-slate-300">
                  Required Documents Checklist (Check all that apply):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {allAvailableDocs.map((doc) => {
                    const isChecked = selectedDocs.includes(doc);
                    return (
                      <label key={doc} className="flex items-center space-x-2 text-slate-300 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleDoc(doc)}
                          className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0"
                        />
                        <span>{doc}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-slate-800 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Scheme Config</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
