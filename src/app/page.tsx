"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { ApplicantPortal } from "@/components/applicant/ApplicantPortal";
import { AdminPortal } from "@/components/admin/AdminPortal";
import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";

export default function Home() {
  const currentUser = useQuery(api.users.getCurrentUser);

  return (
    <RouteGuard>
      <div className="min-h-full pb-12">
        {currentUser?.role === "student" && <ApplicantPortal />}
        {currentUser?.role === "moTAAdmin" && <AdminPortal />}
        {currentUser?.role === "instituteNodal" && (
          <div className="max-w-4xl mx-auto my-12 p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4 shadow-2xl">
            <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/30">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Institute Nodal Officer Desk</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Institute Verification Portal</h2>
            <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
              Logged in as <strong className="text-white">{currentUser.name || currentUser.email}</strong>. Access the university desk to endorse student applications for your institution.
            </p>
            <div className="pt-4">
              <Link
                href="/institute"
                className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-lg hover:shadow-amber-500/20"
              >
                <span>Open Institute Verification Desk</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </RouteGuard>
  );
}
