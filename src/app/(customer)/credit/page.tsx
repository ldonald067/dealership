"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";

interface CreditApp {
  id: string;
  status: string;
  annualIncome: number;
  employerName: string;
  submittedAt: string;
  reviewNote: string | null;
}

const housingOptions = [
  { value: "OWN", label: "Own" },
  { value: "RENT", label: "Rent" },
  { value: "OTHER", label: "Other" },
];

export default function CreditPage() {
  const [apps, setApps] = useState<CreditApp[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    annualIncome: "",
    employerName: "",
    employmentYears: "",
    housingStatus: "RENT",
    monthlyHousing: "",
    ssnLastFour: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    fetch("/api/credit")
      .then((r) => r.json())
      .then(setApps);
  }, []);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.employerName.trim()) errs.employerName = "Required";
    if (!form.employmentYears || parseInt(form.employmentYears) < 0) errs.employmentYears = "Enter a valid number";
    if (!form.annualIncome || parseFloat(form.annualIncome) <= 0) errs.annualIncome = "Enter your income";
    if (!form.monthlyHousing) errs.monthlyHousing = "Enter your monthly payment";
    if (!form.dateOfBirth) errs.dateOfBirth = "Required";
    if (!form.ssnLastFour || form.ssnLastFour.length !== 4) errs.ssnLastFour = "Enter 4 digits";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      toast.error("Missing info", { description: "Please fill in all required fields." });
      return;
    }
    setSubmitting(true);

    try {
      const res = await fetch("/api/credit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          annualIncome: parseFloat(form.annualIncome),
          employerName: form.employerName,
          employmentYears: parseInt(form.employmentYears),
          housingStatus: form.housingStatus,
          monthlyHousing: parseFloat(form.monthlyHousing),
          ssnLastFour: form.ssnLastFour,
          dateOfBirth: form.dateOfBirth,
        }),
      });

      if (res.ok) {
        toast.success("Application submitted! 🎉", {
          description: "We'll review it and get back to you soon.",
        });
        setSubmitted(true);
        const updated = await fetch("/api/credit").then((r) => r.json());
        setApps(updated);
      } else {
        toast.error("Submission failed", {
          description: "Something went wrong. Please try again.",
        });
      }
    } catch {
      toast.error("Connection error", {
        description: "Check your internet and try again.",
      });
    }
    setSubmitting(false);
  }

  const statusConfig: Record<string, { color: string; icon: string; bg: string }> = {
    SUBMITTED: { color: "bg-blue-50 text-blue-700", icon: "📨", bg: "bg-blue-500" },
    APPROVED: { color: "bg-emerald-50 text-emerald-700", icon: "🥳", bg: "bg-emerald-500" },
    DENIED: { color: "bg-red-50 text-red-700", icon: "😔", bg: "bg-red-500" },
    NEEDS_INFO: { color: "bg-amber-50 text-amber-700", icon: "🤔", bg: "bg-amber-500" },
  };

  const hasActiveApp = apps.some((a) => a.status === "SUBMITTED" || a.status === "APPROVED");

  if (submitted || hasActiveApp) {
    const latest = apps[0];
    const config = statusConfig[latest?.status] || statusConfig.SUBMITTED;
    return (
      <div className="p-6 md:p-10 max-w-2xl">
        <div className="flex items-center gap-4">
          <img src="/illustrations/bank1.png" alt="" width={64} height={48} className="shrink-0 hidden sm:block" />
          <h1 className="text-2xl font-bold text-teal-800">Credit Application</h1>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${config.bg} text-4xl mb-4 shadow-sm`}>
            {config.icon}
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            {latest?.status === "APPROVED"
              ? "You're Pre-Approved!"
              : latest?.status === "DENIED"
              ? "Application Not Approved"
              : latest?.status === "NEEDS_INFO"
              ? "We Need More Info"
              : "Application Submitted"}
          </h2>
          <p className="text-gray-500 mt-2">
            {latest?.status === "APPROVED"
              ? "Great news! You can proceed to book your appointment."
              : latest?.status === "DENIED"
              ? "We weren't able to approve your application at this time."
              : latest?.status === "NEEDS_INFO"
              ? "Please check the note below and update your application."
              : "We'll review your application and get back to you soon."}
          </p>
          {latest && (
            <span
              className={`inline-flex items-center gap-1.5 mt-4 text-sm px-3 py-1 rounded-full font-medium ${config.color}`}
            >
              {config.icon} {latest.status.replace("_", " ")}
            </span>
          )}
          {latest?.reviewNote && (
            <div className="mt-4 p-3 rounded-xl bg-gray-50 text-sm text-gray-600 text-left">
              <span className="font-medium">💬 Dealer note:</span> {latest.reviewNote}
            </div>
          )}
        </div>

        {latest?.status === "APPROVED" && (
          <Link href="/appointments" className="group block mt-6">
            <div className="bg-orange-500 rounded-2xl p-5 flex items-center gap-4 text-white hover:bg-orange-600 transition-colors">
              <span className="text-2xl">🗓️</span>
              <div className="flex-1">
                <p className="font-bold">You&apos;re pre-approved! Book your visit</p>
                <p className="text-orange-100 text-sm">Pick a time for your test drive & signing</p>
              </div>
              <span className="text-orange-200 group-hover:translate-x-1 transition-transform text-lg">→</span>
            </div>
          </Link>
        )}
      </div>
    );
  }

  const inputClass = (field: string) =>
    `mt-1 w-full rounded-xl border px-4 py-2.5 text-sm focus:ring-1 outline-none transition-colors ${
      errors[field]
        ? "border-red-300 focus:border-red-400 focus:ring-red-400 bg-red-50/30"
        : "border-gray-200 focus:border-orange-400 focus:ring-orange-400"
    }`;

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <div className="flex items-center gap-4">
        <img src="/illustrations/bank1.png" alt="" width={64} height={48} className="shrink-0 hidden sm:block" />
        <div>
          <h1 className="text-2xl font-bold text-teal-800">Credit Application</h1>
          <p className="text-gray-500 mt-1">
            Get pre-approved so everything is ready when you arrive
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Employment */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center text-base">💼</span>
            Employment Info
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Employer Name</label>
              <input
                type="text"
                value={form.employerName}
                onChange={(e) => { setForm({ ...form, employerName: e.target.value }); setErrors({ ...errors, employerName: "" }); }}
                className={inputClass("employerName")}
                placeholder="Acme Corp"
              />
              {errors.employerName && <p className="text-xs text-red-500 mt-1">{errors.employerName}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Years Employed</label>
              <input
                type="number"
                min="0"
                value={form.employmentYears}
                onChange={(e) => { setForm({ ...form, employmentYears: e.target.value }); setErrors({ ...errors, employmentYears: "" }); }}
                className={inputClass("employmentYears")}
                placeholder="3"
              />
              {errors.employmentYears && <p className="text-xs text-red-500 mt-1">{errors.employmentYears}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Annual Income</label>
              <div className="relative mt-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  value={form.annualIncome}
                  onChange={(e) => { setForm({ ...form, annualIncome: e.target.value }); setErrors({ ...errors, annualIncome: "" }); }}
                  className={`w-full rounded-xl border pl-8 pr-4 py-2.5 text-sm focus:ring-1 outline-none transition-colors ${errors.annualIncome ? "border-red-300 focus:border-red-400 focus:ring-red-400 bg-red-50/30" : "border-gray-200 focus:border-orange-400 focus:ring-orange-400"}`}
                  placeholder="65000"
                />
              </div>
              {errors.annualIncome && <p className="text-xs text-red-500 mt-1">{errors.annualIncome}</p>}
            </div>
          </div>
        </div>

        {/* Housing */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-base">🏡</span>
            Housing Info
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Housing Status</label>
              <div className="flex gap-2 mt-1">
                {housingOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, housingStatus: opt.value })}
                    className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      form.housingStatus === opt.value
                        ? "bg-orange-500 text-white shadow-md"
                        : "bg-gray-50 text-gray-600 hover:bg-orange-50 border border-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Monthly Payment</label>
              <div className="relative mt-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  value={form.monthlyHousing}
                  onChange={(e) => { setForm({ ...form, monthlyHousing: e.target.value }); setErrors({ ...errors, monthlyHousing: "" }); }}
                  className={`w-full rounded-xl border pl-8 pr-4 py-2.5 text-sm focus:ring-1 outline-none transition-colors ${errors.monthlyHousing ? "border-red-300 focus:border-red-400 focus:ring-red-400 bg-red-50/30" : "border-gray-200 focus:border-orange-400 focus:ring-orange-400"}`}
                  placeholder="1500"
                />
              </div>
              {errors.monthlyHousing && <p className="text-xs text-red-500 mt-1">{errors.monthlyHousing}</p>}
            </div>
          </div>
        </div>

        {/* Personal */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-base">🧑</span>
            Personal Info
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Date of Birth</label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => { setForm({ ...form, dateOfBirth: e.target.value }); setErrors({ ...errors, dateOfBirth: "" }); }}
                className={inputClass("dateOfBirth")}
              />
              {errors.dateOfBirth && <p className="text-xs text-red-500 mt-1">{errors.dateOfBirth}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">SSN (last 4 digits)</label>
              <input
                type="text"
                maxLength={4}
                pattern="\d{4}"
                value={form.ssnLastFour}
                onChange={(e) => { setForm({ ...form, ssnLastFour: e.target.value.replace(/\D/g, "").slice(0, 4) }); setErrors({ ...errors, ssnLastFour: "" }); }}
                className={inputClass("ssnLastFour")}
                placeholder="••••"
              />
              {errors.ssnLastFour && <p className="text-xs text-red-500 mt-1">{errors.ssnLastFour}</p>}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </button>

        <p className="text-xs text-gray-400 text-center">
          🔒 This is a soft credit check and won&apos;t affect your credit score.
        </p>
      </form>
    </div>
  );
}
