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
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
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
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      description: "Endorses student applications for NIT Rourkela.",
    },
    {
      title: "MoTA Admin Officer",
      role: "moTAAdmin" as UserRole,
      email: "admin@mota.gov.in",
      password: "Admin@123",
      name: "Director MoTA (Delhi)",
      badge: "MoTA Super Admin",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
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
      // First attempt sign-in
      try {
        await signIn("password", {
          email: account.email,
          password: account.password,
          flow: "signIn",
        });
      } catch (signInErr) {
        // If sign in fails, auto register demo account
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
    <div className="max-w-4xl mx-auto my-8 px-4">
      {/* Header Badge */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full text-amber-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Government of India • Ministry of Tribal Affairs (MoTA)</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          SETU Authentication Portal
        </h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Secure, Role-Based Access Control for Tribal Scholarship Management, Scrutiny Workbench & Fund Release.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-6 items-start">
        {/* Main Auth Form Card */}
        <div className="md:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Background Gradient */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Tab Switcher: Sign In vs Sign Up */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("signIn");
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === "signIn"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
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
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === "signUp"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Register New Account
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signUp" && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Ramesh Munda"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Official / Student Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.gov.in"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* Registration Role Selector (Prototype Demo requirement) */}
            {mode === "signUp" && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="block text-xs font-semibold text-amber-400">
                  Select User Role for Demo Registration:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      role === "student"
                        ? "bg-amber-500/10 border-amber-500 text-amber-300"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <User className="w-4 h-4 mb-1" />
                    <div className="text-[11px] font-bold">Student</div>
                    <div className="text-[9px] opacity-70">Applicant</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("instituteNodal")}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      role === "instituteNodal"
                        ? "bg-amber-500/10 border-amber-500 text-amber-300"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <Building2 className="w-4 h-4 mb-1" />
                    <div className="text-[11px] font-bold">Institute Nodal</div>
                    <div className="text-[9px] opacity-70">University Desk</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("moTAAdmin")}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      role === "moTAAdmin"
                        ? "bg-amber-500/10 border-amber-500 text-amber-300"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <Sliders className="w-4 h-4 mb-1" />
                    <div className="text-[11px] font-bold">MoTA Admin</div>
                    <div className="text-[9px] opacity-70">Ministry Admin</div>
                  </button>
                </div>

                {role === "instituteNodal" && (
                  <div className="pt-2">
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Assigned Institution Name
                    </label>
                    <input
                      type="text"
                      value={institute}
                      onChange={(e) => setInstitute(e.target.value)}
                      placeholder="e.g. National Institute of Technology, Rourkela"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-amber-500/20 disabled:opacity-50 mt-4"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === "signIn" ? "Sign In to Portal" : "Complete Registration"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Demo Accounts Panel (Expandable / Visible for Hackathon Judges) */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
            <button
              type="button"
              onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-xs text-white uppercase tracking-wider">
                  Quick Demo Accounts
                </span>
              </div>
              <div className="text-slate-400">
                {showDemoAccounts ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            <p className="text-[11px] text-slate-400 mt-1 mb-4">
              Click any account below for instant 1-click test authentication as student, institute nodal, or MoTA admin.
            </p>

            {showDemoAccounts && (
              <div className="space-y-3">
                {demoAccounts.map((acc, i) => (
                  <div
                    key={i}
                    onClick={() => handleQuickLogin(acc)}
                    className="p-3.5 bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-2xl cursor-pointer transition-all hover:bg-slate-800/60 group"
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors">
                        {acc.title}
                      </span>
                      <span
                        className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${acc.badgeColor}`}
                      >
                        {acc.badge}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">
                      {acc.description}
                    </p>

                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300 flex justify-between items-center">
                      <span>{acc.email}</span>
                      <span className="text-amber-400 font-bold group-hover:translate-x-1 transition-transform">
                        Login →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 text-[11px] text-slate-400 space-y-2">
            <div className="flex items-center space-x-2 text-slate-300 font-bold">
              <BookOpen className="w-4 h-4 text-emerald-400" />
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
