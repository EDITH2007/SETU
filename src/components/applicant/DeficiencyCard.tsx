"use client";

import React, { useState } from "react";
import { DocumentItem } from "@/types";
import { useSetu } from "@/context/SetuContext";
import { AlertTriangle, Upload, RefreshCw, CheckCircle2, Languages, FileText } from "lucide-react";

interface DeficiencyCardProps {
  applicationId: string;
  document: DocumentItem;
}

export const DeficiencyCard: React.FC<DeficiencyCardProps> = ({ applicationId, document }) => {
  const { resubmitDocument, retryAiCheck } = useSetu();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);

  const handleResubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName) return;

    setIsSubmitting(true);
    try {
      await resubmitDocument(applicationId, document.id, newFileName);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetryAi = async () => {
    setIsRetrying(true);
    try {
      await retryAiCheck(applicationId, document.id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="bg-rose-50/60 border border-rose-200 rounded-3xl p-5 sm:p-6 shadow-md text-stone-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-rose-700 text-white font-bold text-[10px] uppercase px-3.5 py-1 rounded-bl-2xl tracking-wider shadow-xs">
        Action Required • Deficiency Flagged
      </div>

      <div className="flex items-start space-x-3 mb-4">
        <div className="bg-rose-100 p-2.5 rounded-2xl border border-rose-300 text-rose-800 mt-1 shrink-0">
          <AlertTriangle className="w-5 h-5 text-rose-700" />
        </div>
        <div>
          <h4 className="font-display font-bold text-base text-rose-950 flex flex-wrap items-center gap-2">
            <span>{document.type} Flagged</span>
            <span className="text-xs text-rose-900 font-mono bg-white px-2.5 py-0.5 rounded-md border border-rose-300 shadow-xs">
              {document.fileName}
            </span>
          </h4>
          <p className="text-xs text-stone-600 mt-0.5">
            Puter.js AI Document Intelligence flagged statutory compliance issue.
          </p>
        </div>
      </div>

      {/* English Deficiency Notice */}
      <div className="bg-white p-4 rounded-2xl border border-rose-200 text-xs mb-3 space-y-1 shadow-xs">
        <div className="font-semibold text-rose-900 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-rose-700 shrink-0" />
          <span>English Notice (Puter AI Extracted):</span>
        </div>
        <p className="text-stone-800 leading-relaxed pl-5 font-sans">
          {document.deficiencyReason || "Document expired or missing statutory digital signature."}
        </p>
      </div>

      {/* Hindi Translation Notice */}
      <div className="bg-white p-4 rounded-2xl border border-amber-300/70 text-xs mb-4 space-y-1 shadow-xs">
        <div className="font-semibold text-amber-900 flex items-center gap-1.5 font-hindi">
          <Languages className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>हिन्दी विवरण (Hindi Notice):</span>
        </div>
        <p className="text-stone-800 font-hindi leading-relaxed pl-5 text-sm">
          {document.deficiencyReasonHindi || "आय प्रमाण पत्र / जाति प्रमाण पत्र में त्रुटि - कृपया नया दस्तावेज़ अपलोड करें।"}
        </p>
      </div>

      {/* Upload Resubmission Form */}
      <form onSubmit={handleResubmit} className="space-y-3 bg-white p-4.5 rounded-2xl border border-stone-200 shadow-xs">
        <label className="block text-xs font-bold text-stone-900">
          Upload Corrected Document File:
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder={`e.g. ${document.type.replace(/\s+/g, "_")}_NEW_2026.pdf`}
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            className="flex-1 bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#1E2B37] font-mono"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting || !newFileName}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50 cursor-pointer shadow-md"
          >
            {isSubmitting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Resubmit Document</span>
              </>
            )}
          </button>
        </div>

        <div className="flex justify-between items-center pt-2 text-[11px] text-stone-500 border-t border-stone-100">
          <span>Resubmission Count: <strong className="font-mono text-stone-800">{document.resubmissionCount}</strong></span>

          <button
            type="button"
            onClick={handleRetryAi}
            disabled={isRetrying}
            className="text-[#C58B2B] hover:text-amber-800 font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isRetrying ? "animate-spin" : ""}`} />
            <span>Manual Retry AI Check</span>
          </button>
        </div>
      </form>

      {successMsg && (
        <div className="mt-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs p-3.5 rounded-2xl flex items-center space-x-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>Document resubmitted successfully! Puter AI cleared deficiency flag.</span>
        </div>
      )}
    </div>
  );
};

