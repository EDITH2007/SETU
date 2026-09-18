"use client";

import React from "react";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { Building2, CheckCircle2, FileText, Filter, Search, ShieldCheck } from "lucide-react";
import { useSetu } from "@/context/SetuContext";

export default function InstitutePage() {
  const { applications, updateApplicationStatus } = useSetu();

  return (
    <RouteGuard allowedRoles={["instituteNodal"]}>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Banner */}
        <div className="bg-white border border-[#E7E2D7] rounded-3xl p-6 sm:p-8 space-y-3 relative overflow-hidden shadow-md">
          <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-900 px-3.5 py-1 rounded-full text-xs font-mono font-semibold border border-amber-300">
            <Building2 className="w-4 h-4 text-[#C58B2B]" />
            <span>Institute Verification Desk • Ministry of Tribal Affairs</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-bold text-stone-900 tracking-tight">
            University &amp; Institute Endorsement Portal
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
            As an Institute Nodal Officer, verify student enrollment status, bonafide certificates, and fee structure receipts before forwarding applications to the MoTA Central Scrutiny Workbench.
          </p>
        </div>

        {/* Verification Workbench Table */}
        <div className="bg-white border border-[#E7E2D7] rounded-3xl p-6 sm:p-8 shadow-md space-y-5">
          <div className="flex justify-between items-center pb-4 border-b border-stone-200">
            <h2 className="text-xl font-display font-semibold text-stone-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#C58B2B]" />
              <span>Assigned Student Applications ({applications.length})</span>
            </h2>
            <span className="text-xs text-stone-600 font-mono bg-stone-100 px-3 py-1 rounded-full border border-stone-300">Filter: Active Institution</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-stone-200 shadow-xs">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-[#F9F7F1] text-stone-600 uppercase text-[10px] tracking-wider font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-3.5">App Number</th>
                  <th className="p-3.5">Student Name</th>
                  <th className="p-3.5">Scheme</th>
                  <th className="p-3.5">Institution</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-sans">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-stone-500">
                      No student applications registered for your institute yet.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-[#C58B2B] tracking-wider">{app.applicationNumber}</td>
                      <td className="p-3.5 text-stone-900 font-medium">{app.studentName}</td>
                      <td className="p-3.5 font-mono text-stone-600">{app.schemeCode}</td>
                      <td className="p-3.5 text-stone-500 truncate max-w-[200px]">{app.institute}</td>
                      <td className="p-3.5">
                        <span className="bg-indigo-50 text-indigo-900 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-indigo-200">
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => updateApplicationStatus(app.id, "DocumentScrutiny")}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition-all shadow-xs transform active:scale-95 cursor-pointer"
                        >
                          Endorse &amp; Forward →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </RouteGuard>
  );
}
