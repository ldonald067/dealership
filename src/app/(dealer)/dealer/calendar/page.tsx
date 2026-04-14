"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Appointment {
  id: string;
  dateTime: string;
  purpose: string;
  status: string;
  notes: string | null;
  user: { firstName: string; lastName: string; email: string; phone: string | null };
  vehicle: { year: number; make: string; model: string; trim: string | null } | null;
}

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"upcoming" | "today" | "all">("upcoming");
  const [confirmAction, setConfirmAction] = useState<{ id: string; status: string } | null>(null);

  useEffect(() => {
    fetch("/api/dealer/appointments")
      .then((r) => r.json())
      .then((data) => { setAppointments(data); setLoading(false); });
  }, []);

  async function handleStatusChange(id: string, status: string) {
    try {
      const res = await fetch("/api/dealer/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        const labels: Record<string, string> = {
          CONFIRMED: "Appointment confirmed! Customer will be notified. ✅",
          CANCELLED: "Appointment cancelled.",
          COMPLETED: "Appointment marked as complete! 🏁",
        };
        toast.success(labels[status] || "Updated!");
        const updated = await fetch("/api/dealer/appointments").then((r) => r.json());
        setAppointments(updated);
      } else {
        toast.error("Failed to update");
      }
    } catch {
      toast.error("Connection error");
    }
    setConfirmAction(null);
  }

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  const filtered = appointments.filter((a) => {
    const date = a.dateTime.split("T")[0];
    if (filter === "today") return date === todayStr;
    if (filter === "upcoming") return new Date(a.dateTime) >= now;
    return true;
  });

  const statusConfig: Record<string, { color: string; icon: string }> = {
    PENDING: { color: "bg-amber-50 text-amber-700", icon: "⏳" },
    CONFIRMED: { color: "bg-emerald-50 text-emerald-700", icon: "✅" },
    CANCELLED: { color: "bg-red-50 text-red-700", icon: "❌" },
    COMPLETED: { color: "bg-blue-50 text-blue-700", icon: "🏁" },
  };

  if (loading) {
    return (
      <div className="p-6 md:p-10">
        <h1 className="text-2xl font-bold text-gray-800">Appointment Calendar</h1>
        <div className="mt-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Appointment Calendar</h1>
          <p className="text-gray-500 mt-1">{filtered.length} appointments</p>
        </div>
        <div className="flex gap-2">
          {(["today", "upcoming", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-orange-50 border border-gray-200"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
            <p className="text-4xl mb-4">☕</p>
            <p className="text-gray-400 font-medium">
              {filter === "today" ? "No appointments today — take a breather!" : "No appointments found"}
            </p>
          </div>
        ) : (
          filtered.map((apt) => {
            const config = statusConfig[apt.status] || statusConfig.PENDING;
            return (
              <div key={apt.id} className={`bg-white rounded-2xl shadow-sm border p-5 ${apt.status === "PENDING" ? "border-amber-200" : "border-gray-100"}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-gray-800">
                        {apt.user.firstName} {apt.user.lastName}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${config.color}`}>
                        {config.icon} {apt.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      🗓️ {new Date(apt.dateTime).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      {" at "}
                      {new Date(apt.dateTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>✉️ {apt.user.email}</span>
                      {apt.user.phone && <span>📱 {apt.user.phone}</span>}
                    </div>
                    {apt.vehicle && (
                      <p className="text-sm text-gray-600 mt-1">
                        🏎️ {apt.vehicle.year} {apt.vehicle.make} {apt.vehicle.model} {apt.vehicle.trim || ""}
                      </p>
                    )}
                    {apt.notes && (
                      <p className="text-sm text-gray-400 italic mt-1">💬 &ldquo;{apt.notes}&rdquo;</p>
                    )}
                  </div>

                  {apt.status === "PENDING" && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setConfirmAction({ id: apt.id, status: "CONFIRMED" })}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600 transition-colors"
                      >
                        ✅ Confirm
                      </button>
                      <button
                        onClick={() => setConfirmAction({ id: apt.id, status: "CANCELLED" })}
                        className="px-3 py-1.5 rounded-lg bg-red-100 text-red-600 text-xs font-medium hover:bg-red-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {apt.status === "CONFIRMED" && (
                    <button
                      onClick={() => setConfirmAction({ id: apt.id, status: "COMPLETED" })}
                      className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-600 text-xs font-medium hover:bg-blue-200 transition-colors ml-4"
                    >
                      🏁 Complete
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {confirmAction && (
        <ConfirmDialog
          open={!!confirmAction}
          onOpenChange={(open) => { if (!open) setConfirmAction(null); }}
          title={
            confirmAction.status === "CONFIRMED" ? "Confirm this appointment?"
              : confirmAction.status === "CANCELLED" ? "Cancel this appointment?"
              : "Mark as complete?"
          }
          description={
            confirmAction.status === "CANCELLED"
              ? "The customer will be notified their appointment was cancelled."
              : confirmAction.status === "CONFIRMED"
              ? "The customer will be notified their appointment is confirmed."
              : "This marks the appointment as finished."
          }
          confirmLabel={confirmAction.status === "CANCELLED" ? "Yes, cancel" : "Confirm"}
          variant={confirmAction.status === "CANCELLED" ? "danger" : "default"}
          onConfirm={() => handleStatusChange(confirmAction.id, confirmAction.status)}
        />
      )}
    </div>
  );
}
