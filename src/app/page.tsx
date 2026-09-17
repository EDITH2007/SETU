"use client";

import React from "react";
import { useSetu } from "@/context/SetuContext";
import { ApplicantPortal } from "@/components/applicant/ApplicantPortal";
import { AdminPortal } from "@/components/admin/AdminPortal";

export default function Home() {
  const { role } = useSetu();

  return (
    <div className="min-h-full pb-12">
      {role === "student" && <ApplicantPortal />}
      {role === "moTAAdmin" && <AdminPortal />}
      {role === "institute" && (
        <div className="max-w-4xl mx-auto my-12 p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4">
          <div className="inline-block bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/30">
            Institute Nodal Officer Verification Desk
          </div>
          <h2 className="text-2xl font-bold text-white">Institute Verification Portal</h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Institute Nodal Desk allows university registrars to endorse student enrollment and bonafide fee receipts before forwarding to the MoTA Scrutiny Workbench.
          </p>
          <div className="pt-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-amber-500 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs"
            >
              Switch Role in Header Nav
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
