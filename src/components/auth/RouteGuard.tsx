"use client";

import React, { ReactNode } from "react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { AuthScreen } from "./AuthScreen";
import { UserRole } from "@/types";
import { ShieldAlert, ArrowRight } from "lucide-react";
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-xs font-semibold text-slate-400 tracking-wider font-mono">
          VERIFYING SETU SECURITY CREDENTIALS...
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
        <div className="max-w-xl mx-auto my-16 p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4 shadow-2xl">
          <div className="inline-flex p-3 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/20">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-white">Access Restricted</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your authenticated account (<strong className="text-white">{currentUser.email}</strong>) has the role of{" "}
            <strong className="text-amber-400 font-mono">{currentUser.role}</strong>. You are not authorized to view this page.
          </p>
          <div className="pt-2">
            <Link
              href={targetRoute}
              className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all"
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
