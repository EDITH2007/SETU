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
    <div className="bg-rose-950/30 border border-rose-800/80 rounded-2xl p-5 shadow-lg text-slate-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-rose-600 text-white font-bold text-[10px] uppercase px-3 py-1 rounded-bl-xl tracking-wider">
        Action Required • Deficiency Flagged
      </div>

      <div className="flex items-start space-x-3 mb-4">
        <div className="bg-rose-500/20 p-2.5 rounded-xl border border-rose-500/40 text-rose-400 mt-1">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-base text-rose-200 flex items-center gap-2">
            <span>{document.type} Flagged</span>
            <span className="text-xs text-rose-300 font-mono bg-rose-900/60 px-2 py-0.5 rounded border border-rose-700">
              {document.fileName}
            </span>
          </h4>
          <p className="text-xs text-rose-300/80">
            Puter.js AI Document Intelligence flagged statutory compliance issue.
          </p>
        </div>
      </div>

      {/* English Deficiency Notice */}
      <div className="bg-slate-950/80 p-3.5 rounded-xl border border-rose-900/60 text-xs mb-3 space-y-1">
        <div className="font-semibold text-rose-300 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-rose-400" />
          <span>English Notice (Puter AI Extracted):</span>
        </div>
        <p className="text-slate-300 leading-relaxed pl-5">
          {document.deficiencyReason || "Document expired or missing statutory digital signature."}
        </p>
      </div>

      {/* Hindi Translation Notice */}
      <div className="bg-slate-950/80 p-3.5 rounded-xl border border-rose-900/60 text-xs mb-4 space-y-1">
        <div className="font-semibold text-amber-300 flex items-center gap-1.5 font-hindi">
          <Languages className="w-3.5 h-3.5 text-amber-400" />
          <span>हिन्दी विवरण (Hindi Notice):</span>
        </div>
        <p className="text-slate-200 font-hindi leading-relaxed pl-5 text-sm">
          {document.deficiencyReasonHindi || "आय प्रमाण पत्र / जाति प्रमाण पत्र में त्रुटि - कृपया नया दस्तावेज़ अपलोड करें।"}
        </p>
      </div>

      {/* Upload Resubmission Form */}
      <form onSubmit={handleResubmit} className="space-y-3 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
        <label className="block text-xs font-bold text-slate-200">
          Upload Corrected Document File:
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder={`e.g. ${document.type.replace(/\s+/g, "_")}_NEW_2026.pdf`}
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting || !newFileName}
            className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
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

        <div className="flex justify-between items-center pt-2 text-[11px] text-slate-400 border-t border-slate-800">
          <span>Resubmission Count: {document.resubmissionCount}</span>

          <button
            type="button"
            onClick={handleRetryAi}
            disabled={isRetrying}
            className="text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1 transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${isRetrying ? "animate-spin" : ""}`} />
            <span>Manual Retry AI Check</span>
          </button>
        </div>
      </form>

      {successMsg && (
        <div className="mt-3 bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs p-3 rounded-xl flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Document resubmitted successfully! Puter AI cleared deficiency flag.</span>
        </div>
      )}
    </div>
  );
};
