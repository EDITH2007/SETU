"use client";

import React, { useState } from "react";
import { useSetu } from "@/context/SetuContext";
import { UserRole } from "@/types";
import {
  ShieldCheck,
  Bell,
  RotateCcw,
  User,
  Building2,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  FileText,
  X,
  Smartphone,
  Mail,
} from "lucide-react";

export const Header: React.FC = () => {
  const { role, setRole, notifications, markNotificationRead, resetToSeedData } = useSetu();
  const [showNotifs, setShowNotifs] = useState(false);
  const [activeSimulatedMsg, setActiveSimulatedMsg] = useState<any>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

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
            DEMO ENVIRONMENT • STAGE 2.4
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
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Puter.js AI Active
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Scholarship Empowerment & Transparent Utilization Platform
            </p>
          </div>
        </div>

        {/* Dynamic Role Switcher & Header Controls */}
        <div className="flex items-center space-x-3">
          {/* Role Selector Pill */}
          <div className="bg-[#1A3A6D] p-1 rounded-lg border border-blue-800 flex items-center space-x-1 shadow-inner">
            <span className="text-xs text-slate-400 px-2 font-semibold hidden sm:inline">Role:</span>
            
            <button
              onClick={() => setRole("student")}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                role === "student"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-blue-800/60"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Applicant Portal</span>
            </button>

            <button
              onClick={() => setRole("moTAAdmin")}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                role === "moTAAdmin"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-blue-800/60"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>MoTA Admin Portal</span>
            </button>

            <button
              onClick={() => setRole("institute")}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                role === "institute"
                  ? "bg-amber-500 text-slate-950 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-blue-800/60"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Institute Nodal</span>
            </button>
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="p-2 rounded-lg bg-[#1A3A6D] border border-blue-800 hover:bg-blue-800 text-slate-200 hover:text-white relative transition-all"
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
            className="p-2 rounded-lg bg-[#1A3A6D] border border-blue-800 hover:bg-rose-900/60 hover:border-rose-700 text-slate-300 hover:text-rose-200 transition-all flex items-center space-x-1 text-xs"
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
