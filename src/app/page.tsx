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
          <div className="max-w-4xl mx-auto my-12 p-8 bg-white border border-[#E7E2D7] rounded-3xl text-center space-y-4 shadow-xl">
            <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-900 px-3 py-1 rounded-full text-xs font-bold border border-amber-300">
              <Building2 className="w-4 h-4 text-[#C58B2B]" />
              <span>Institute Nodal Officer Desk</span>
            </div>
            <h2 className="text-2xl font-bold text-stone-900">Institute Verification Portal</h2>
            <p className="text-xs text-stone-600 max-w-lg mx-auto leading-relaxed">
              Logged in as <strong className="text-stone-900">{currentUser.name || currentUser.email}</strong>. Access the university desk to endorse student applications for your institution.
            </p>
            <div className="pt-4">
              <Link
                href="/institute"
                className="inline-flex items-center space-x-2 bg-[#1E2B37] hover:bg-[#121B24] text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-all shadow-md"
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
