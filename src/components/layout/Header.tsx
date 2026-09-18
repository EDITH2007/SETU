"use client";

import React, { useState } from "react";
import { useAuthActions, useConvexAuth } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useSetu } from "@/context/SetuContext";
import {
  ShieldCheck,
  Bell,
  RotateCcw,
  User,
  Building2,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  X,
  Smartphone,
  Mail,
  LogOut,
  Sparkles,
} from "lucide-react";

export const Header: React.FC = () => {
  const { signOut } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();
  const currentUser = useQuery(api.users.getCurrentUser);

  const { notifications, markNotificationRead, resetToSeedData } = useSetu();
  const [showNotifs, setShowNotifs] = useState(false);
  const [activeSimulatedMsg, setActiveSimulatedMsg] = useState<any>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "moTAAdmin":
        return { label: "MoTA Admin", color: "bg-emerald-50 text-emerald-800 border-emerald-300", icon: Sliders };
      case "instituteNodal":
        return { label: "Institute Nodal", color: "bg-amber-50 text-amber-900 border-amber-300", icon: Building2 };
      default:
        return { label: "Student Applicant", color: "bg-indigo-50 text-indigo-900 border-indigo-300", icon: User };
    }
  };

  const roleInfo = getRoleLabel(currentUser?.role);
  const RoleIcon = roleInfo.icon;

  return (
    <header className="bg-[#FAF8F3]/95 text-stone-900 border-b border-[#E7E2D7] sticky top-0 z-40 backdrop-blur-md shadow-xs">
      {/* Top Govt Bar */}
      <div className="bg-[#F0ECE1] text-xs py-1.5 px-4 text-stone-700 flex justify-between items-center border-b border-[#E2DDD0]">
        <div className="flex items-center space-x-3 text-[11px] font-medium">
          <span className="font-bold text-[#C58B2B] tracking-wide">भारत सरकार | Government of India</span>
          <span className="text-stone-400">|</span>
          <span className="text-stone-800 font-semibold">जनजातीय कार्य मंत्रालय | Ministry of Tribal Affairs (MoTA)</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="bg-amber-100/80 text-amber-900 px-2.5 py-0.5 rounded text-[10px] font-mono border border-amber-300/80 tracking-wider font-semibold">
            RBAC SECURED • STAGE 2.4
          </span>
        </div>
      </div>

      {/* Main Header Nav */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-3">
        {/* Brand */}
        <div className="flex items-center space-x-3.5">
          <div className="bg-[#1E2B37] p-2 rounded-xl text-amber-400 font-bold flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-6 h-6 text-[#C58B2B]" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="font-display font-black text-2xl tracking-tight text-[#1E2B37] flex items-center gap-1.5">
                SETU <span className="text-[#C58B2B] font-hindi text-lg font-normal">(सेतु)</span>
              </h1>
              <span className="bg-emerald-50 text-emerald-800 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-700" />
                Convex Auth & Puter.js AI
              </span>
            </div>
            <p className="text-[11px] text-stone-600 font-medium tracking-wide">
              Scholarship Empowerment & Transparent Utilization Platform
            </p>
          </div>
        </div>

        {/* User Status Badge & Auth Header Controls */}
        <div className="flex items-center space-x-3">
          {isAuthenticated && currentUser ? (
            <>
              {/* Read-Only Role & Identity Indicator */}
              <div className="bg-white px-3.5 py-1.5 rounded-xl border border-[#E2DDD0] flex items-center space-x-2.5 shadow-xs">
                <div className="w-7 h-7 bg-amber-50 text-[#C58B2B] rounded-lg flex items-center justify-center border border-amber-200">
                  <RoleIcon className="w-4 h-4" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-stone-900 truncate max-w-[140px]">
                    {currentUser.name || currentUser.email}
                  </div>
                  <div className="text-[10px] font-bold text-[#C58B2B] flex items-center gap-1">
                    <span>{roleInfo.label}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${roleInfo.color} sm:hidden`}>
                  {roleInfo.label}
                </span>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={() => signOut()}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          ) : (
            <div className="text-xs text-stone-600 font-mono bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-300">
              Unauthenticated Session
            </div>
          )}

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="p-2 rounded-xl bg-white border border-[#E2DDD0] hover:bg-stone-100 text-stone-700 hover:text-stone-900 relative transition-all cursor-pointer shadow-xs"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-stone-200 rounded-2xl shadow-2xl z-50 text-stone-900 overflow-hidden">
                <div className="p-3.5 bg-stone-50 border-b border-stone-200 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-[#C58B2B]" />
                    <span className="font-bold text-xs uppercase tracking-wider text-stone-900">Notifications & Alerts</span>
                  </div>
                  <span className="text-xs text-stone-500 font-mono">{notifications.length} Total</span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-stone-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-stone-500">No notifications yet.</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.simulatedDelivery) setActiveSimulatedMsg(n);
                        }}
                        className={`p-3.5 text-xs hover:bg-stone-50 cursor-pointer transition-colors ${
                          !n.read ? "bg-amber-50/60 font-medium" : "text-stone-700"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-stone-900 flex items-center gap-1">
                            {n.type === "deficiency" && <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
                            {n.type === "status_change" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                            {n.title}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-stone-600 text-[11px] leading-relaxed mb-1.5">{n.message}</p>

                        {n.simulatedDelivery && (
                          <div className="flex items-center space-x-2 text-[10px] text-stone-600 bg-stone-50 p-1.5 rounded-lg border border-stone-200">
                            <Smartphone className="w-3 h-3 text-emerald-700" />
                            <span>Simulated SMS/Email Sent</span>
                            <span className="text-[#C58B2B] font-semibold underline ml-auto">Preview →</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (confirm("Reset entire SETU platform database to default seed state (~40 applications, schemes, grievances, & baseline disbursements)?")) {
                resetToSeedData();
              }
            }}
            className="p-2 rounded-xl bg-white border border-[#E2DDD0] hover:bg-rose-50 hover:border-rose-300 text-stone-700 hover:text-rose-800 transition-all flex items-center space-x-1.5 text-xs cursor-pointer shadow-xs"
            title="Reset all platform data (applications, schemes, grievances, and disbursements)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden xl:inline text-[11px] font-semibold">Reset All Data</span>
          </button>
        </div>
      </div>

      {/* Simulated SMS / Email Preview Modal */}
      {activeSimulatedMsg && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-stone-200 rounded-3xl max-w-md w-full p-6 shadow-2xl text-stone-900 relative">
            <button
              onClick={() => setActiveSimulatedMsg(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-[#C58B2B] font-bold mb-4 border-b border-stone-200 pb-3">
              <Smartphone className="w-5 h-5 text-[#C58B2B]" />
              <span>Simulated Dispatch Log (Govt SMS Gateway & Email)</span>
            </div>

            <div className="space-y-4">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
                <div className="flex items-center space-x-2 text-emerald-800 font-semibold mb-2">
                  <Mail className="w-4 h-4 text-emerald-700" />
                  <span>Email Dispatch (Simulated Adapter)</span>
                </div>
                <div className="text-stone-600 font-mono text-[11px]">
                  <div>To: {activeSimulatedMsg.recipientId}@student.gov.in</div>
                  <div>Subject: {activeSimulatedMsg.title}</div>
                  <div className="mt-2 text-stone-800 font-sans leading-relaxed">
                    {activeSimulatedMsg.message}
                  </div>
                </div>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs">
                <div className="flex items-center space-x-2 text-amber-800 font-semibold mb-2">
                  <Smartphone className="w-4 h-4 text-amber-700" />
                  <span>SMS Dispatch (mSeva NIC Gateway)</span>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 font-mono text-[11px] text-emerald-900 leading-relaxed">
                  {activeSimulatedMsg.simulatedDelivery?.smsText || activeSimulatedMsg.message}
                </div>
              </div>

              <div className="text-[11px] text-stone-600 bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                💡 <strong>Production Adapter Note:</strong> Connects to NIC Mobile Seva SMS Gateway API and CDAC e-Mail Service API in live deployment.
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

