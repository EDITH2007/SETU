"use client";

import React from "react";
import { SimulatedAdapterBadge } from "@/components/common/SimulatedAdapterBadge";
import { ShieldCheck, HelpCircle, PhoneCall, Mail } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F0ECE1] text-stone-700 border-t border-[#E2DDD0] text-xs py-10 px-4 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center space-x-2 text-[#1E2B37] font-display font-bold text-lg mb-2">
            <ShieldCheck className="w-5 h-5 text-[#C58B2B]" />
            <span>SETU Platform <span className="font-hindi font-normal text-[#C58B2B] text-sm">(सेतु)</span></span>
          </div>
          <p className="text-stone-600 leading-relaxed text-[11px] mb-3">
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
          <h4 className="text-stone-900 font-bold mb-3 text-xs uppercase tracking-wider">MoTA Core Schemes</h4>
          <ul className="space-y-2 text-[11px] text-stone-600">
            <li className="hover:text-[#C58B2B] transition-colors cursor-pointer">• NFST - National Fellowship for ST Students (Ph.D / M.Phil)</li>
            <li className="hover:text-[#C58B2B] transition-colors cursor-pointer">• NOS - National Overseas Scholarship for ST Students</li>
            <li className="hover:text-[#C58B2B] transition-colors cursor-pointer">• Pre-Matric Scholarship for ST Students (Class IX & X)</li>
            <li className="hover:text-[#C58B2B] transition-colors cursor-pointer">• Post-Matric Scholarship for ST Students</li>
          </ul>
        </div>

        <div>
          <h4 className="text-stone-900 font-bold mb-3 text-xs uppercase tracking-wider">Platform Capabilities</h4>
          <ul className="space-y-2 text-[11px] text-stone-600">
            <li>• Deterministic Merit & Eligibility Scoring</li>
            <li>• Puter.js AI OCR Document Intelligence</li>
            <li>• Hindi Deficiency Notice Generation</li>
            <li>• Bottleneck Radar & Dwell-Time Heatmaps</li>
            <li>• Fund Pulse Fellowship Burn Rate Forecasting</li>
          </ul>
        </div>

        <div>
          <h4 className="text-stone-900 font-bold mb-3 text-xs uppercase tracking-wider">Grievance & Support Desk</h4>
          <div className="space-y-2.5 text-[11px]">
            <div className="flex items-center space-x-2 text-stone-700">
              <PhoneCall className="w-3.5 h-3.5 text-[#C58B2B]" />
              <span>Toll Free Helpline: 1800-11-7788</span>
            </div>
            <div className="flex items-center space-x-2 text-stone-700">
              <Mail className="w-3.5 h-3.5 text-[#C58B2B]" />
              <span>Support: setu-mota@gov.in</span>
            </div>
            <div className="flex items-center space-x-2 text-amber-900 font-semibold mt-2 bg-amber-100/70 p-2 rounded-lg border border-amber-300">
              <HelpCircle className="w-3.5 h-3.5 shrink-0 text-amber-800" />
              <span>SLA Escalation SLA: 7 Days Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-[#E2DDD0] flex flex-wrap justify-between items-center text-[11px] text-stone-500">
        <div>
          © 2026 Ministry of Tribal Affairs, Government of India. Designed for National Informatics Centre (NIC) Compliance.
        </div>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <span className="hover:text-stone-800 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-stone-800 cursor-pointer">Terms of Service</span>
          <span className="hover:text-stone-800 cursor-pointer">ST Dashboard</span>
        </div>
      </div>
    </footer>
  );
};

