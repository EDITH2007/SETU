"use client";

import React, { useState } from "react";
import { ShieldAlert, Info, ExternalLink } from "lucide-react";

interface SimulatedAdapterBadgeProps {
  systemName: "DigiLocker" | "PFMS / Direct Benefit Transfer (DBT)" | "mSeva NIC SMS Gateway" | "Aadhaar e-KYC";
  description: string;
}

export const SimulatedAdapterBadge: React.FC<SimulatedAdapterBadgeProps> = ({ systemName, description }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center space-x-1.5 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer shadow-sm"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
        <span>Simulated Adapter: {systemName}</span>
        <Info className="w-3 h-3 text-amber-400" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-slate-100">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 shadow-2xl relative">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-base mb-3 border-b border-slate-800 pb-3">
              <ShieldAlert className="w-5 h-5" />
              <span>Integration Specification — {systemName}</span>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                In this prototype demo, live API calls to <strong>{systemName}</strong> are simulated via internal JSON adapters to avoid credential dependencies during evaluation.
              </p>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1 text-slate-400">
                <div className="text-amber-300 font-bold">// Production Roadmap Architecture</div>
                <div>Protocol: REST OAuth2.0 / SAML 2.0</div>
                <div>Provider: MeitY DigiLocker API / PFMS DBT Gateway</div>
                <div>Status: Mocked with real data schema</div>
              </div>

              <p className="text-slate-400">
                {description}
              </p>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs"
              >
                Close Specification
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
