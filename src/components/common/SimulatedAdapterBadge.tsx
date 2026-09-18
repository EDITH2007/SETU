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
        className="inline-flex items-center space-x-2 bg-amber-100/80 hover:bg-amber-200/80 text-amber-900 border border-dashed border-amber-600/70 px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer shadow-xs active:scale-95"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping"></span>
        <span>Simulated Adapter: {systemName}</span>
        <Info className="w-3.5 h-3.5 text-amber-700" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 text-stone-900">
          <div className="bg-white border border-amber-500/40 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative">
            <div className="flex items-center space-x-2 text-amber-800 font-display font-semibold text-lg mb-3 border-b border-stone-200 pb-3">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <span>Integration Specification — {systemName}</span>
            </div>

            <div className="space-y-3.5 text-xs text-stone-600 leading-relaxed">
              <p>
                In this prototype demo, live API calls to <strong className="text-stone-900">{systemName}</strong> are simulated via internal JSON adapters to avoid credential dependencies during evaluation.
              </p>

              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 font-mono text-[11px] space-y-1 text-stone-700">
                <div className="text-amber-800 font-bold">// Production Roadmap Architecture</div>
                <div>Protocol: REST OAuth2.0 / SAML 2.0</div>
                <div>Provider: MeitY DigiLocker API / PFMS DBT Gateway</div>
                <div>Status: Mocked with real data schema</div>
              </div>

              <p className="text-stone-500 text-xs">
                {description}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-[#1E2B37] hover:bg-[#121B24] text-white font-bold px-5 py-2 rounded-xl text-xs transition-all shadow-md active:scale-95"
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
