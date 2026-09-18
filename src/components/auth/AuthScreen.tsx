"use client";

import React, { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  ShieldCheck,
  User,
  Building2,
  Sliders,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  BookOpen,
  Clock,
  FileCheck,
  Flame,
  Shield,
  Zap,
} from "lucide-react";
import { UserRole } from "@/types";

interface AuthScreenProps {
  onSuccess?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const { signIn } = useAuthActions();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [institute, setInstitute] = useState("National Institute of Technology, Rourkela");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDemoAccounts, setShowDemoAccounts] = useState(true);

  const demoAccounts = [
    {
      title: "Applicant / Student Demo",
      role: "student" as UserRole,
      email: "student@setu.gov.in",
      password: "Student@123",
      name: "Rahul ST Applicant",
      badge: "Student Portal",
      badgeColor: "bg-indigo-50 text-indigo-900 border-indigo-300",
      description: "Tied to personal applications & document deficiencies.",
    },
    {
      title: "Institute Nodal Officer",
      role: "instituteNodal" as UserRole,
      email: "nodal@nitrkl.ac.in",
      password: "Nodal@123",
      name: "Prof. S. Jena (NIT Rourkela)",
      institute: "National Institute of Technology, Rourkela",
      badge: "Institute Verification",
      badgeColor: "bg-amber-50 text-amber-900 border-amber-300",
      description: "Endorses student applications for NIT Rourkela.",
    },
    {
      title: "MoTA Admin Officer",
      role: "moTAAdmin" as UserRole,
      email: "admin@mota.gov.in",
      password: "Admin@123",
      name: "Director MoTA (Delhi)",
      badge: "MoTA Super Admin",
      badgeColor: "bg-emerald-50 text-emerald-900 border-emerald-300",
      description: "Full access to Scrutiny Workbench, Bottleneck Radar & Fund Pulse.",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "signUp") {
        await signIn("password", {
          email: email.trim().toLowerCase(),
          password,
          name: name.trim() || email.split("@")[0],
          role,
          institute: role === "instituteNodal" ? institute : "",
          flow: "signUp",
        });
      } else {
        await signIn("password", {
          email: email.trim().toLowerCase(),
          password,
          flow: "signIn",
        });
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(
        err.message ||
          "Authentication failed. Please verify your credentials or select a demo account below."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (account: typeof demoAccounts[0]) => {
    setLoading(true);
    setError(null);
    setEmail(account.email);
    setPassword(account.password);

    try {
      try {
        await signIn("password", {
          email: account.email,
          password: account.password,
          flow: "signIn",
        });
      } catch (signInErr) {
        await signIn("password", {
          email: account.email,
          password: account.password,
          name: account.name,
          role: account.role,
          institute: account.institute || "",
          flow: "signUp",
        });
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Quick login failed:", err);
      setError(err.message || "Failed to log in with demo account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto my-6 px-4 space-y-12">
      {/* 1. NARRATIVE HERO SECTION */}
      <section className="text-center space-y-6 pt-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center space-x-2 bg-amber-100/80 border border-amber-300 px-3.5 py-1.5 rounded-full text-amber-900 text-xs font-semibold shadow-xs">
          <ShieldCheck className="w-4 h-4 text-[#C58B2B] shrink-0" />
          <span>भारत सरकार • Government of India • Ministry of Tribal Affairs (MoTA)</span>
        </div>

        <h1 className="font-display text-3xl sm:text-5xl font-black text-stone-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Empowering Tribal Scholars with <span className="text-[#C58B2B] font-normal italic">Glass-Box Transparency</span> & Accelerated Disbursements
        </h1>

        <p className="text-sm sm:text-base text-stone-700 max-w-2xl mx-auto leading-relaxed font-sans">
          SETU <span className="font-hindi text-[#C58B2B]">(सेतु)</span> connects ST applicants, university nodal officers, and the Ministry of Tribal Affairs through AI-assisted document intelligence, deterministic rule scoring, and real-time bottleneck analytics.
        </p>

        {/* Narrative Flow Grid: The Problem vs The Platform */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left max-w-4xl mx-auto pt-4">
          {/* Problem Card */}
          <div className="bg-white border border-stone-200 hover:border-stone-300 rounded-2xl p-5 space-y-2 relative overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
              <Clock className="w-4 h-4 text-rose-600" />
              <span>The Bureaucratic Challenge</span>
            </div>
            <h3 className="font-display text-lg font-bold text-stone-900">18-Day Scrutiny Bottleneck</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Traditional ST scholarship workflows suffer from manual document verification delays, opaque eligibility criteria, and untracked grievance dwell times that stall fellowship stipends.
            </p>
          </div>

          {/* Solution Card */}
          <div className="bg-white border border-amber-300/80 hover:border-amber-400 rounded-2xl p-5 space-y-2 relative overflow-hidden bg-gradient-to-br from-amber-50/50 to-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <Zap className="w-4 h-4 text-[#C58B2B]" />
              <span>The SETU Solution</span>
            </div>
            <h3 className="font-display text-lg font-bold text-stone-900">Deterministic AI & Fund Pulse</h3>
            <p className="text-xs text-stone-700 leading-relaxed">
              Glass-box eligibility scoring, Puter.js AI OCR document auditing, real-time Bottleneck Radar, and guaranteed 7-day grievance SLA escalation directly to MoTA leadership.
            </p>
          </div>
        </div>
      </section>

      {/* 2. OFFICIAL AUTHENTICATION PORTAL & DEMO ACCOUNTS */}
      <div className="grid md:grid-cols-12 gap-8 items-start pt-4">
        {/* Main Auth Form Card */}
        <div className="md:col-span-7 bg-white border border-[#E7E2D7] rounded-3xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-all relative overflow-hidden">
          <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-stone-200">
            <Shield className="w-5 h-5 text-[#C58B2B]" />
            <h2 className="font-display text-xl font-bold text-stone-900">Official Access Portal</h2>
            <span className="ml-auto text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
              SSL/TLS Encrypted
            </span>
          </div>

          {/* Tab Switcher: Sign In vs Sign Up */}
          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("signIn");
                setError(null);
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === "signIn"
                  ? "bg-[#1E2B37] text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Sign In to SETU
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signUp");
                setError(null);
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === "signUp"
                  ? "bg-[#1E2B37] text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              Register New Account
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signUp" && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Ramesh Munda"
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#1E2B37] focus:ring-1 focus:ring-[#1E2B37] transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Official / Student Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.gov.in"
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#1E2B37] focus:ring-1 focus:ring-[#1E2B37] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#1E2B37] focus:ring-1 focus:ring-[#1E2B37] transition-colors"
                />
              </div>
            </div>

            {/* Registration Role Selector */}
            {mode === "signUp" && (
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <label className="block text-xs font-semibold text-[#C58B2B]">
                  Select User Role for Registration:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      role === "student"
                        ? "bg-amber-50 border-[#C58B2B] text-stone-900 font-bold"
                        : "bg-[#FAF8F5] border-stone-200 text-stone-600 hover:border-stone-300"
                    }`}
                  >
                    <User className="w-4 h-4 mb-1 text-[#C58B2B]" />
                    <div className="text-[11px] font-bold">Student</div>
                    <div className="text-[9px] opacity-70">Applicant</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("instituteNodal")}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      role === "instituteNodal"
                        ? "bg-amber-50 border-[#C58B2B] text-stone-900 font-bold"
                        : "bg-[#FAF8F5] border-stone-200 text-stone-600 hover:border-stone-300"
                    }`}
                  >
                    <Building2 className="w-4 h-4 mb-1 text-[#C58B2B]" />
                    <div className="text-[11px] font-bold">Institute Nodal</div>
                    <div className="text-[9px] opacity-70">University Desk</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("moTAAdmin")}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      role === "moTAAdmin"
                        ? "bg-amber-50 border-[#C58B2B] text-stone-900 font-bold"
                        : "bg-[#FAF8F5] border-stone-200 text-stone-600 hover:border-stone-300"
                    }`}
                  >
                    <Sliders className="w-4 h-4 mb-1 text-[#C58B2B]" />
                    <div className="text-[11px] font-bold">MoTA Admin</div>
                    <div className="text-[9px] opacity-70">Ministry Admin</div>
                  </button>
                </div>

                {role === "instituteNodal" && (
                  <div className="pt-2">
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Assigned Institution Name
                    </label>
                    <input
                      type="text"
                      value={institute}
                      onChange={(e) => setInstitute(e.target.value)}
                      placeholder="e.g. National Institute of Technology, Rourkela"
                      className="w-full bg-[#FAF8F5] border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                    />
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1E2B37] hover:bg-[#121B24] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 mt-4 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === "signIn" ? "Sign In to Portal" : "Complete Registration"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Demo Accounts Panel */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white border border-[#E7E2D7] rounded-3xl p-5 shadow-md">
            <button
              type="button"
              onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              className="w-full flex items-center justify-between text-left cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#C58B2B]" />
                <span className="font-bold text-xs text-stone-900 uppercase tracking-wider">
                  Hackathon 1-Click Demo Accounts
                </span>
              </div>
              <div className="text-stone-400">
                {showDemoAccounts ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            <p className="text-[11px] text-stone-600 mt-1 mb-4">
              Click any role below for instant test authentication as student, institute nodal, or MoTA super admin.
            </p>

            {showDemoAccounts && (
              <div className="space-y-3">
                {demoAccounts.map((acc, i) => (
                  <div
                    key={i}
                    onClick={() => handleQuickLogin(acc)}
                    className="p-3.5 bg-[#FAF8F5] border border-stone-200 hover:border-[#C58B2B] rounded-2xl cursor-pointer transition-all hover:bg-amber-50/40 group"
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="font-bold text-xs text-stone-900 group-hover:text-[#C58B2B] transition-colors">
                        {acc.title}
                      </span>
                      <span
                        className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${acc.badgeColor}`}
                      >
                        {acc.badge}
                      </span>
                    </div>

                    <p className="text-[10px] text-stone-600 mb-2 leading-relaxed">
                      {acc.description}
                    </p>

                    <div className="bg-white p-2 rounded-xl border border-stone-200 text-[10px] font-mono text-stone-700 flex justify-between items-center shadow-xs">
                      <span>{acc.email}</span>
                      <span className="text-[#C58B2B] font-bold group-hover:translate-x-1 transition-transform">
                        Login →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-[11px] text-stone-600 space-y-2">
            <div className="flex items-center space-x-2 text-stone-800 font-bold">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>Server-Side RBAC Active</span>
            </div>
            <p className="leading-relaxed">
              All Convex queries & mutations validate identity and permissions on the server. Unauthenticated requests are rejected immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

