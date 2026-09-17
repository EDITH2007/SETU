"use client";

import React from "react";
import { SimulatedAdapterBadge } from "@/components/common/SimulatedAdapterBadge";
import { ShieldCheck, HelpCircle, PhoneCall, Mail } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs py-8 px-4 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div>
          <div className="flex items-center space-x-2 text-white font-bold text-base mb-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>SETU Platform (सेतु)</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px] mb-3">
            AI-Enabled Scholarship & Fellowship Transparency Management System for the Ministry of Tribal Affairs (MoTA), Government of India.
          </p>
          <div className="flex flex-wrap gap-2">
            <SimulatedAdapterBadge
              systemName="DigiLocker"
              description="Verifies caste and income certificates directly against State Revenue databases."
            />
            <SimulatedAdapterBadge
              systemName="PFMS / Direct Benefit Transfer (DBT)"
              description="Direct Benefit Transfer gateway for quarterly fellowship stipend release."
            />
          </div>
        </div>

        <div>
          <h4 className="text-slate-200 font-bold mb-3 text-xs uppercase tracking-wider">MoTA Core Schemes</h4>
          <ul className="space-y-1.5 text-[11px]">
            <li>• NFST - National Fellowship for ST Students (Ph.D / M.Phil)</li>
            <li>• NOS - National Overseas Scholarship for ST Students</li>
            <li>• Pre-Matric Scholarship for ST Students (Class IX & X)</li>
            <li>• Post-Matric Scholarship for ST Students</li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-200 font-bold mb-3 text-xs uppercase tracking-wider">Platform Capabilities</h4>
          <ul className="space-y-1.5 text-[11px]">
            <li>• Deterministic Merit & Eligibility Scoring</li>
            <li>• Puter.js AI OCR Document Intelligence</li>
            <li>• Hindi Deficiency Notice Generation</li>
            <li>• Bottleneck Radar & Dwell-Time Heatmaps</li>
            <li>• Fund Pulse Fellowship Burn Rate Forecasting</li>
          </ul>
        </div>

        <div>
          <h4 className="text-slate-200 font-bold mb-3 text-xs uppercase tracking-wider">Grievance & Support Desk</h4>
          <div className="space-y-2 text-[11px]">
            <div className="flex items-center space-x-2 text-slate-300">
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>Toll Free Helpline: 1800-11-7788</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Support: setu-mota@gov.in</span>
            </div>
            <div className="flex items-center space-x-2 text-amber-400 font-semibold mt-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>SLA Escalation SLA: 7 Days Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-4 border-t border-slate-800/80 flex flex-wrap justify-between items-center text-[11px] text-slate-500">
        <div>
          © 2026 Ministry of Tribal Affairs, Government of India. Designed for National Informatics Centre (NIC) Compliance.
        </div>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>ST Dashboard</span>
        </div>
      </div>
    </footer>
  );
};
