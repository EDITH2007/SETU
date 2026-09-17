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
        return { label: "MoTA Admin", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", icon: Sliders };
      case "instituteNodal":
        return { label: "Institute Nodal", color: "bg-amber-500/20 text-amber-300 border-amber-500/30", icon: Building2 };
      default:
        return { label: "Student Applicant", color: "bg-blue-500/20 text-blue-300 border-blue-500/30", icon: User };
    }
  };

  const roleInfo = getRoleLabel(currentUser?.role);
  const RoleIcon = roleInfo.icon;

  return (
    <header className="bg-[#0F2C59] text-white border-b border-blue-900 shadow-md sticky top-0 z-40">
      {/* Top Govt Bar */}
      <div className="bg-[#0A1E3F] text-xs py-1 px-4 text-slate-300 flex justify-between items-center border-b border-blue-900/50">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-amber-400">भारत सरकार | Government of India</span>
          <span className="text-slate-500">|</span>
          <span>जनजातीय कार्य मंत्रालय | Ministry of Tribal Affairs (MoTA)</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-slate-400 hidden md:inline">Accessibility Options</span>
          <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[11px] font-mono border border-amber-500/30">
            RBAC SECURED • STAGE 2.4
          </span>
        </div>
      </div>

      {/* Main Header Nav */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-3">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="bg-amber-500 p-2 rounded-lg text-slate-950 font-bold flex items-center justify-center shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-black text-xl tracking-tight text-white flex items-center gap-1.5">
                SETU <span className="text-amber-400 font-hindi text-base font-normal">(सेतु)</span>
              </h1>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Convex Auth & Puter.js AI
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Scholarship Empowerment & Transparent Utilization Platform
            </p>
          </div>
        </div>

        {/* User Status Badge & Auth Header Controls */}
        <div className="flex items-center space-x-3">
          {isAuthenticated && currentUser ? (
            <>
              {/* Read-Only Role & Identity Indicator */}
              <div className="bg-[#1A3A6D] px-3 py-1.5 rounded-xl border border-blue-800 flex items-center space-x-2.5 shadow-inner">
                <div className="w-7 h-7 bg-amber-500/20 text-amber-300 rounded-lg flex items-center justify-center border border-amber-500/30">
                  <RoleIcon className="w-4 h-4" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-white truncate max-w-[140px]">
                    {currentUser.name || currentUser.email}
                  </div>
                  <div className="text-[10px] font-medium text-amber-300 flex items-center gap-1">
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
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all flex items-center space-x-1.5"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          ) : (
            <div className="text-xs text-slate-400 font-mono">
              Unauthenticated Session
            </div>
          )}

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="p-2 rounded-xl bg-[#1A3A6D] border border-blue-800 hover:bg-blue-800 text-slate-200 hover:text-white relative transition-all"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 text-slate-100 overflow-hidden">
                <div className="p-3 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold text-sm">Notifications & Alerts</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">{notifications.length} Total</span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">No notifications yet.</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.simulatedDelivery) setActiveSimulatedMsg(n);
                        }}
                        className={`p-3 text-xs hover:bg-slate-800/80 cursor-pointer transition-colors ${
                          !n.read ? "bg-blue-950/40 font-medium" : "text-slate-300"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-amber-300 flex items-center gap-1">
                            {n.type === "deficiency" && <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
                            {n.type === "status_change" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px] leading-relaxed mb-1.5">{n.message}</p>

                        {n.simulatedDelivery && (
                          <div className="flex items-center space-x-2 text-[10px] text-slate-400 bg-slate-950/70 p-1.5 rounded border border-slate-800">
                            <Smartphone className="w-3 h-3 text-emerald-400" />
                            <span>Simulated SMS/Email Sent</span>
                            <span className="text-amber-400 font-semibold underline ml-auto">Preview →</span>
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
              if (confirm("Reset SETU database to default seed state (~40 applications)?")) {
                resetToSeedData();
              }
            }}
            className="p-2 rounded-xl bg-[#1A3A6D] border border-blue-800 hover:bg-rose-900/60 hover:border-rose-700 text-slate-300 hover:text-rose-200 transition-all flex items-center space-x-1 text-xs"
            title="Reset Demo Dataset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px]">Reset Data</span>
          </button>
        </div>
      </div>

      {/* Simulated SMS / Email Preview Modal */}
      {activeSimulatedMsg && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 shadow-2xl text-slate-100 relative">
            <button
              onClick={() => setActiveSimulatedMsg(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-amber-400 font-bold mb-3 border-b border-slate-800 pb-3">
              <Smartphone className="w-5 h-5" />
              <span>Simulated Dispatch Log (Govt SMS Gateway & Email)</span>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center space-x-2 text-emerald-400 font-semibold mb-2">
                  <Mail className="w-4 h-4" />
                  <span>Email Dispatch (Simulated Adapter)</span>
                </div>
                <div className="text-slate-400 font-mono text-[11px]">
                  <div>To: {activeSimulatedMsg.recipientId}@student.gov.in</div>
                  <div>Subject: {activeSimulatedMsg.title}</div>
                  <div className="mt-2 text-slate-200 font-sans leading-relaxed">
                    {activeSimulatedMsg.message}
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center space-x-2 text-amber-400 font-semibold mb-2">
                  <Smartphone className="w-4 h-4" />
                  <span>SMS Dispatch (mSeva NIC Gateway)</span>
                </div>
                <div className="bg-emerald-950/40 p-2.5 rounded border border-emerald-800/50 font-mono text-[11px] text-emerald-300">
                  {activeSimulatedMsg.simulatedDelivery?.smsText || activeSimulatedMsg.message}
                </div>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700">
                💡 <strong>Production Adapter Note:</strong> Connects to NIC Mobile Seva SMS Gateway API and CDAC e-Mail Service API in live deployment.
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
