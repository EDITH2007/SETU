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
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-3 relative overflow-hidden">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/30">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Institute Verification Desk • Ministry of Tribal Affairs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            University & Institute Endorsement Portal
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            As an Institute Nodal Officer, verify student enrollment status, bonafide certificates, and fee structure receipts before forwarding applications to the MoTA Central Scrutiny Workbench.
          </p>
        </div>

        {/* Verification Workbench Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Assigned Student Applications ({applications.length})</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">Filter: Active Institution</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="p-3">App Number</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Scheme</th>
                  <th className="p-3">Institution</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No student applications registered for your institute yet.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-amber-300">{app.applicationNumber}</td>
                      <td className="p-3 text-white font-medium">{app.studentName}</td>
                      <td className="p-3 font-mono text-slate-300">{app.schemeCode}</td>
                      <td className="p-3 text-slate-400 truncate max-w-[200px]">{app.institute}</td>
                      <td className="p-3">
                        <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-[11px] font-semibold border border-blue-500/30">
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => updateApplicationStatus(app.id, "DocumentScrutiny")}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1 rounded-lg text-[11px] transition-all"
                        >
                          Endorse & Forward →
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
