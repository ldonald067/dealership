"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface StatusData {
  documents: { type: string; status: string }[];
  creditApps: { status: string; submittedAt: string }[];
  appointments: {
    id: string;
    dateTime: string;
    status: string;
    dealership: { name: string };
    vehicle: { year: number; make: string; model: string } | null;
  }[];
}

const stages = [
  { key: "vehicles", label: "Browse Vehicles", icon: "🏎️", href: "/vehicles" },
  { key: "documents", label: "Upload Documents", icon: "🗂️", href: "/documents" },
  { key: "credit", label: "Credit Application", icon: "🪙", href: "/credit" },
  { key: "appointment", label: "Book Appointment", icon: "🗓️", href: "/appointments" },
  { key: "visit", label: "Visit Dealership", icon: "🔑", href: "#" },
];

export default function StatusPage() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); });
  }, []);

  function getStageStatus(key: string): "complete" | "active" | "pending" {
    if (!data) return "pending";
    switch (key) {
      case "vehicles":
        return "complete";
      case "documents": {
        const approved = data.documents.filter((d) => d.status === "APPROVED").length;
        if (approved >= 2) return "complete";
        if (data.documents.length > 0) return "active";
        return "pending";
      }
      case "credit":
        if (data.creditApps.length === 0) return "pending";
        if (data.creditApps[0].status === "APPROVED") return "complete";
        return "active";
      case "appointment":
        if (data.appointments.length === 0) return "pending";
        if (data.appointments[0].status === "CONFIRMED") return "complete";
        return "active";
      case "visit":
        if (data.appointments.length > 0 && data.appointments[0].status === "CONFIRMED") return "active";
        return "pending";
      default:
        return "pending";
    }
  }

  if (loading) {
    return (
      <div className="p-6 md:p-10 max-w-3xl">
        <h1 className="text-2xl font-bold text-teal-800">Your Progress</h1>
        <div className="mt-8 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <h1 className="text-2xl font-bold text-teal-800">Your Progress</h1>
      <p className="text-gray-500 mt-1">Track every step toward driving away in your new car</p>

      <div className="mt-8 space-y-1">
        {stages.map((stage, i) => {
          const status = getStageStatus(stage.key);
          return (
            <div key={stage.key} className="relative">
              {i < stages.length - 1 && (
                <div className={`absolute left-7 top-14 w-0.5 h-6 ${status === "complete" ? "bg-emerald-400" : "bg-gray-200"}`} />
              )}
              <Link href={stage.href}>
                <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  status === "active" ? "bg-white shadow-md border-2 border-orange-200"
                    : status === "complete" ? "bg-emerald-50/50 border border-emerald-100"
                    : "bg-white/50 border border-gray-100"
                }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                    status === "complete" ? "bg-emerald-100"
                      : status === "active" ? "bg-orange-500 shadow-sm"
                      : "bg-gray-100"
                  }`}>
                    {status === "complete" ? "✅" : stage.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${
                      status === "active" ? "text-orange-600"
                        : status === "complete" ? "text-emerald-700"
                        : "text-gray-400"
                    }`}>{stage.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {status === "complete" ? "Completed" : status === "active" ? "In progress" : "Not started"}
                    </p>
                  </div>
                  {status === "active" && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 font-medium">Next Step</span>
                  )}
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {data?.appointments?.[0] && (
        <div className="mt-8 bg-orange-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-500/20">
          <p className="text-sm font-medium text-white/80">Upcoming Appointment</p>
          <p className="text-xl font-bold mt-1">
            {new Date(data.appointments[0].dateTime).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          <p className="text-white/80 mt-1">
            {new Date(data.appointments[0].dateTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
            {" at "}{data.appointments[0].dealership.name}
          </p>
          {data.appointments[0].vehicle && (
            <p className="text-white/70 text-sm mt-1">
              {data.appointments[0].vehicle.year} {data.appointments[0].vehicle.make} {data.appointments[0].vehicle.model}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
