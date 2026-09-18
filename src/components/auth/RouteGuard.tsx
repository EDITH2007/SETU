"use client";

import React, { ReactNode } from "react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { AuthScreen } from "./AuthScreen";
import { UserRole } from "@/types";
import { ShieldAlert, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface RouteGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const currentUser = useQuery(api.users.getCurrentUser);

  if (isLoading || (isAuthenticated && currentUser === undefined)) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 space-y-6">
        <div className="flex items-center space-x-3 justify-center text-[#C58B2B]">
          <ShieldCheck className="w-6 h-6 animate-pulse" />
          <span className="font-mono text-xs tracking-wider uppercase font-bold text-stone-700">
            VERIFYING SETU SECURITY CREDENTIALS...
          </span>
        </div>

        {/* Skeleton Grid */}
        <div className="space-y-4">
          <div className="h-28 bg-white rounded-3xl border border-stone-200 animate-shimmer shadow-xs" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-32 bg-white rounded-2xl border border-stone-200 animate-shimmer shadow-xs" />
            <div className="h-32 bg-white rounded-2xl border border-stone-200 animate-shimmer shadow-xs" />
            <div className="h-32 bg-white rounded-2xl border border-stone-200 animate-shimmer shadow-xs" />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !currentUser) {
    return <AuthScreen />;
  }

  // Check role authorization if specific allowedRoles passed
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = currentUser.role as UserRole;
    if (!allowedRoles.includes(userRole)) {
      // Direct user to their correct portal route
      const targetRoute =
        userRole === "moTAAdmin"
          ? "/admin"
          : userRole === "instituteNodal"
          ? "/institute"
          : "/applicant";

      return (
        <div className="max-w-xl mx-auto my-16 p-8 bg-white border border-[#E7E2D7] rounded-3xl text-center space-y-4 shadow-xl">
          <div className="inline-flex p-3.5 bg-rose-50 text-rose-700 rounded-2xl border border-rose-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="font-display text-xl font-bold text-stone-900">Access Restricted</h2>
          <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto">
            Your authenticated account (<strong className="text-stone-900">{currentUser.email}</strong>) has the role of{" "}
            <strong className="text-[#C58B2B] font-mono">{currentUser.role}</strong>. You are not authorized to view this page.
          </p>
          <div className="pt-2">
            <Link
              href={targetRoute}
              className="inline-flex items-center space-x-2 bg-[#1E2B37] hover:bg-[#121B24] text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md"
            >
              <span>Go to Authorized Portal ({userRole})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

