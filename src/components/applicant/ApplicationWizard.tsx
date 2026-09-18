"use client";

import React, { useState } from "react";
import { useSetu } from "@/context/SetuContext";
import { SchemeType } from "@/types";
import { X, Upload, CheckCircle2, Sparkles, FileCheck, ArrowRight } from "lucide-react";

interface ApplicationWizardProps {
  onClose: () => void;
  onSuccess: (appId: string) => void;
}

export const ApplicationWizard: React.FC<ApplicationWizardProps> = ({ onClose, onSuccess }) => {
  const { schemes, createApplication } = useSetu();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [schemeCode, setSchemeCode] = useState<SchemeType>("NFST");
  const [studentName, setStudentName] = useState("Birsa Munda");
  const [studentEmail, setStudentEmail] = useState("birsa.munda@example.gov.in");
  const [studentPhone, setStudentPhone] = useState("+91 9876543210");
  const [state, setState] = useState("Odisha");
  const [institute, setInstitute] = useState("IIT Kharagpur");
  const [incomeAmount, setIncomeAmount] = useState<number>(180000);
  const [marksPercent, setMarksPercent] = useState<number>(82);
  const [age, setAge] = useState<number>(24);
  const [category, setCategory] = useState("ST");

  // Document File Names
  const activeScheme = schemes.find((s) => s.code === schemeCode) || schemes[0];
  const [docFileNames, setDocFileNames] = useState<Record<string, string>>({});

  const handleDocChange = (docType: string, filename: string) => {
    setDocFileNames((prev) => ({ ...prev, [docType]: filename }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const uploadedDocs = activeScheme.requiredDocs.map((docType) => ({
        type: docType,
        fileName: docFileNames[docType] || `${docType.replace(/\s+/g, "_")}_VERIFIED.pdf`,
        fileRef: "/mock_docs/sample.pdf",
      }));

      const appId = await createApplication({
        studentName,
        studentEmail,
        studentPhone,
        state,
        institute,
        schemeCode,
        incomeAmount,
        marksPercent,
        age,
        category,
        uploadedDocs,
      });

      onSuccess(appId);
    } catch (err) {
      console.error("Error creating application:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-stone-900 overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Wizard Header */}
        <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-stone-200">
          <div className="bg-[#1E2B37] p-2.5 rounded-2xl text-amber-400 font-bold shrink-0">
            <Sparkles className="w-6 h-6 text-[#C58B2B]" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-stone-900">MoTA Scholarship Application Wizard</h3>
            <p className="text-xs text-stone-600 mt-0.5">
              Puter.js AI-assisted instant verification & statutory rule evaluation.
            </p>
          </div>
        </div>

        {/* Stepper Header Pills */}
        <div className="flex justify-between items-center mb-6 bg-[#FAF8F5] p-1.5 rounded-2xl border border-stone-200 text-xs font-semibold text-stone-600">
          <div
            className={`flex-1 text-center py-2 rounded-xl transition-all ${
              step === 1 ? "bg-[#1E2B37] text-white font-extrabold shadow-xs" : step > 1 ? "text-emerald-700 font-bold" : ""
            }`}
          >
            1. Choose Scheme
          </div>
          <div
            className={`flex-1 text-center py-2 rounded-xl transition-all ${
              step === 2 ? "bg-[#1E2B37] text-white font-extrabold shadow-xs" : step > 2 ? "text-emerald-700 font-bold" : ""
            }`}
          >
            2. Personal & Academic
          </div>
          <div
            className={`flex-1 text-center py-2 rounded-xl transition-all ${
              step === 3 ? "bg-[#1E2B37] text-white font-extrabold shadow-xs" : ""
            }`}
          >
            3. Upload Documents
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* STEP 1: SCHEME SELECT */}
          {step === 1 && (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Select Scholarship / Fellowship Scheme:
              </label>

              <div className="grid grid-cols-1 gap-3">
                {schemes.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSchemeCode(s.code)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      schemeCode === s.code
                        ? "bg-amber-50/80 border-[#C58B2B] ring-1 ring-[#C58B2B]/40 shadow-xs"
                        : "bg-[#FAF8F5] border-stone-200 hover:border-stone-300"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-display font-bold text-sm text-[#C58B2B]">{s.name}</span>
                      <span className="text-[10px] bg-stone-200 px-2 py-0.5 rounded-md text-stone-800 font-mono font-bold">
                        {s.code}
                      </span>
                    </div>
                    <div className="text-xs text-stone-600 mb-2">{s.eligibilityRules.programmeType}</div>
                    <div className="flex flex-wrap gap-3 text-[11px] text-stone-700 font-mono bg-white p-2.5 rounded-xl border border-stone-200">
                      <span>Ceiling: ₹{(s.eligibilityRules.incomeCeiling / 100000).toFixed(1)} LPA</span>
                      <span>•</span>
                      <span>Min Marks: {s.eligibilityRules.minMarksPercent}%</span>
                      <span>•</span>
                      <span>Freq: {s.disbursementFrequency}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-[#1E2B37] hover:bg-[#121B24] text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 cursor-pointer shadow-md"
                >
                  <span>Continue to Details</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PERSONAL DETAILS */}
          {step === 2 && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Full Student Name *</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 focus:border-[#1E2B37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 focus:border-[#1E2B37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 focus:border-[#1E2B37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Home State *</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 focus:border-[#1E2B37] focus:outline-none"
                  >
                    <option value="Odisha">Odisha</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Maharashtra">Maharashtra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Institution / University *</label>
                  <input
                    type="text"
                    required
                    value={institute}
                    onChange={(e) => setInstitute(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 focus:border-[#1E2B37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Annual Household Income (₹) *</label>
                  <input
                    type="number"
                    required
                    value={incomeAmount}
                    onChange={(e) => setIncomeAmount(Number(e.target.value))}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 focus:border-[#1E2B37] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Academic Marks % *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={100}
                    value={marksPercent}
                    onChange={(e) => setMarksPercent(Number(e.target.value))}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 focus:border-[#1E2B37] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Age (Years) *</label>
                  <input
                    type="number"
                    required
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-stone-900 focus:border-[#1E2B37] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-[#1E2B37] hover:bg-[#121B24] text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center space-x-2 cursor-pointer shadow-md"
                >
                  <span>Continue to Documents</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DOCUMENT UPLOAD */}
          {step === 3 && (
            <div className="space-y-4 text-xs">
              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-300 text-amber-900 flex items-center space-x-2.5">
                <Sparkles className="w-4 h-4 text-[#C58B2B] shrink-0" />
                <span>Puter.js AI OCR will scan files on submission to verify authority seals and extracted fields.</span>
              </div>

              <div className="space-y-3">
                {activeScheme.requiredDocs.map((docType) => (
                  <div key={docType} className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-stone-900">{docType} *</span>
                      <span className="text-[10px] text-emerald-800 font-mono flex items-center gap-1">
                        <FileCheck className="w-3 h-3 text-emerald-700" />
                        <span>OCR Schema Ready</span>
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={`File name: e.g. ${docType.replace(/\s+/g, "_")}_VERIFIED.pdf`}
                        value={docFileNames[docType] || `${docType.replace(/\s+/g, "_")}_VERIFIED.pdf`}
                        onChange={(e) => handleDocChange(docType, e.target.value)}
                        className="flex-1 bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 font-mono focus:outline-none focus:border-[#1E2B37]"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition-all disabled:opacity-50 cursor-pointer shadow-lg"
                >
                  {isSubmitting ? (
                    <span>Puter AI Scanning & Submitting...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Official Application</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

