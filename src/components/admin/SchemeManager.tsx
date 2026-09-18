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
    <div className="bg-white border border-[#E7E2D7] rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 text-[#1C1917]">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 pb-5 border-b border-[#E7E2D7]">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-mono bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300 font-semibold flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#C58B2B]" />
              <span>No-Code Statutory Form Editor</span>
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-display font-medium text-[#1C1917] tracking-tight">
            Configurable Scheme &amp; Eligibility Engine
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Define statutory eligibility limits, document checklists, and disbursement rules without touching code.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setName("");
            setShowForm(true);
          }}
          className="bg-[#1E2B37] hover:bg-[#2C3B4E] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-md transition-all transform active:scale-95"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" />
          <span>Configure New Scheme</span>
        </button>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {schemes.map((s) => (
          <div key={s.id} className="bg-[#FAF8F3] p-6 rounded-2xl border border-[#E7E2D7] hover:border-[#C58B2B] transition-all duration-200 space-y-4 relative group">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-mono px-2.5 py-0.5 rounded font-semibold tracking-wider border border-amber-300">
                  {s.code}
                </span>
                <h4 className="font-display font-semibold text-lg text-stone-900 mt-1.5">{s.name}</h4>
              </div>

              <button
                onClick={() => startEdit(s)}
                className="p-2 text-stone-500 hover:text-stone-900 bg-white hover:bg-stone-50 rounded-xl border border-[#E7E2D7] transition-colors shadow-sm"
                title="Edit Scheme Rules"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-stone-700 font-mono bg-white p-3.5 rounded-xl border border-[#E7E2D7]">
              <div className="flex justify-between"><span className="text-stone-500">Income:</span> <span className="font-semibold text-[#C58B2B]">₹{(s.eligibilityRules.incomeCeiling / 100000).toFixed(1)} LPA</span></div>
              <div className="flex justify-between"><span className="text-stone-500">Min Marks:</span> <span className="font-semibold text-stone-800">{s.eligibilityRules.minMarksPercent}%</span></div>
              <div className="flex justify-between"><span className="text-stone-500">Corpus:</span> <span className="font-semibold text-emerald-700">₹{(s.totalCorpus / 10000000).toFixed(1)} Cr</span></div>
              <div className="flex justify-between"><span className="text-stone-500">Frequency:</span> <span className="font-semibold text-stone-800">{s.disbursementFrequency}</span></div>
            </div>

            <div className="text-xs text-stone-600">
              <span className="font-semibold text-stone-700 block mb-1.5 text-[11px] uppercase tracking-wider">Required Documents ({s.requiredDocs.length}):</span>
              <div className="flex flex-wrap gap-1.5">
                {s.requiredDocs.map((d) => (
                  <span key={d} className="bg-white text-stone-700 text-[10px] px-2.5 py-1 rounded-md border border-[#E7E2D7]">
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
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 text-[#1C1917] overflow-y-auto">
          <div className="bg-white border border-[#E7E2D7] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
            <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-stone-400 hover:text-stone-800 transition-colors">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-semibold text-xl text-[#1C1917] mb-5 pb-3 border-b border-[#E7E2D7] flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#C58B2B]" />
              <span>{editingId ? "Edit Scheme Rule Config" : "Create New Statutory Scheme"}</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-stone-700 font-medium mb-1">Scheme Official Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. National Fellowship for ST Students"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FAF8F3] border border-[#E7E2D7] rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-[#C58B2B]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Scheme Short Code *</label>
                  <select
                    value={code}
                    onChange={(e) => setCode(e.target.value as SchemeType)}
                    className="w-full bg-[#FAF8F3] border border-[#E7E2D7] rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-[#C58B2B]"
                  >
                    <option value="NFST">NFST</option>
                    <option value="NOS">NOS</option>
                    <option value="PreMatric">PreMatric</option>
                    <option value="PostMatric">PostMatric</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Income Ceiling (₹ Per Annum) *</label>
                  <input
                    type="number"
                    required
                    value={incomeCeiling}
                    onChange={(e) => setIncomeCeiling(Number(e.target.value))}
                    className="w-full bg-[#FAF8F3] border border-[#E7E2D7] rounded-xl px-3.5 py-2.5 text-stone-900 font-mono focus:outline-none focus:border-[#C58B2B]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Total Corpus Budget (₹) *</label>
                  <input
                    type="number"
                    required
                    value={totalCorpus}
                    onChange={(e) => setTotalCorpus(Number(e.target.value))}
                    className="w-full bg-[#FAF8F3] border border-[#E7E2D7] rounded-xl px-3.5 py-2.5 text-stone-900 font-mono focus:outline-none focus:border-[#C58B2B]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Minimum Marks % *</label>
                  <input
                    type="number"
                    required
                    value={minMarksPercent}
                    onChange={(e) => setMinMarksPercent(Number(e.target.value))}
                    className="w-full bg-[#FAF8F3] border border-[#E7E2D7] rounded-xl px-3.5 py-2.5 text-stone-900 font-mono focus:outline-none focus:border-[#C58B2B]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Max Age Limit (Years)</label>
                  <input
                    type="number"
                    value={ageMax || ""}
                    onChange={(e) => setAgeMax(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 35 (Leave empty if no limit)"
                    className="w-full bg-[#FAF8F3] border border-[#E7E2D7] rounded-xl px-3.5 py-2.5 text-stone-900 font-mono focus:outline-none focus:border-[#C58B2B]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Disbursement Frequency *</label>
                  <select
                    value={disbursementFrequency}
                    onChange={(e) => setDisbursementFrequency(e.target.value as any)}
                    className="w-full bg-[#FAF8F3] border border-[#E7E2D7] rounded-xl px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-[#C58B2B]"
                  >
                    <option value="Quarterly">Quarterly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
              </div>

              {/* Required Documents Checklist */}
              <div className="pt-2">
                <label className="block font-medium mb-2 text-stone-700">
                  Required Documents Checklist (Check all that apply):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-[#FAF8F3] p-4 rounded-xl border border-[#E7E2D7]">
                  {allAvailableDocs.map((doc) => {
                    const isChecked = selectedDocs.includes(doc);
                    return (
                      <label key={doc} className="flex items-center space-x-2.5 text-stone-800 cursor-pointer text-xs group">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleDoc(doc)}
                          className="rounded border-stone-300 bg-white text-[#1E2B37] focus:ring-0 focus:ring-offset-0"
                        />
                        <span className="group-hover:text-stone-950 transition-colors">{doc}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-5 flex justify-end space-x-3 border-t border-[#E7E2D7]">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors border border-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1E2B37] hover:bg-[#2C3B4E] text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition-all transform active:scale-95"
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

