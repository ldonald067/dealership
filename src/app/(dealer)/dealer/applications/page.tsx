"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Application {
  id: string;
  status: string;
  annualIncome: number;
  employerName: string;
  employmentYears: number;
  housingStatus: string;
  monthlyHousing: number;
  submittedAt: string;
  reviewNote: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    documents: { type: string; status: string; fileName: string }[];
  };
}

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Application | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [updating, setUpdating] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ id: string; status: string; label: string; variant: "default" | "danger" | "warning" } | null>(null);

  useEffect(() => {
    fetch("/api/dealer/applications")
      .then((r) => r.json())
      .then((data) => { setApps(data); setLoading(false); });
  }, []);

  async function handleAction(id: string, status: string) {
    setUpdating(true);
    try {
      const res = await fetch("/api/dealer/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, reviewNote }),
      });
      if (res.ok) {
        const actionLabels: Record<string, string> = {
          APPROVED: "Application approved! Customer will be notified.",
          DENIED: "Application denied.",
          NEEDS_INFO: "Requested more info from customer.",
        };
        toast.success(actionLabels[status] || "Updated!");
        const updated = await fetch("/api/dealer/applications").then((r) => r.json());
        setApps(updated);
        setSelected(null);
        setReviewNote("");
      } else {
        toast.error("Failed to update application");
      }
    } catch {
      toast.error("Connection error");
    }
    setUpdating(false);
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

  const statusConfig: Record<string, { color: string; icon: string }> = {
    SUBMITTED: { color: "bg-blue-50 text-blue-700", icon: "📨" },
    APPROVED: { color: "bg-emerald-50 text-emerald-700", icon: "✅" },
    DENIED: { color: "bg-red-50 text-red-700", icon: "❌" },
    NEEDS_INFO: { color: "bg-amber-50 text-amber-700", icon: "🤔" },
  };

  const docStatusConfig: Record<string, { color: string; icon: string }> = {
    PENDING: { color: "bg-amber-50 text-amber-700", icon: "⏳" },
    APPROVED: { color: "bg-emerald-50 text-emerald-700", icon: "✅" },
    REJECTED: { color: "bg-red-50 text-red-700", icon: "❌" },
  };

  if (loading) {
    return (
      <div className="p-6 md:p-10">
        <h1 className="text-2xl font-bold text-gray-800">Customer Applications</h1>
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
      <h1 className="text-2xl font-bold text-gray-800">Customer Applications</h1>
      <p className="text-gray-500 mt-1">
        {apps.filter((a) => a.status === "SUBMITTED").length} pending review
      </p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2 space-y-3">
          {apps.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200">
              <p className="text-4xl mb-4">🎯</p>
              <p className="text-gray-400 font-medium">No applications yet</p>
              <p className="text-gray-300 text-sm mt-1">Applications will appear here when customers apply</p>
            </div>
          ) : (
            apps.map((app) => {
              const config = statusConfig[app.status] || statusConfig.SUBMITTED;
              return (
                <button
                  key={app.id}
                  onClick={() => { setSelected(app); setReviewNote(app.reviewNote || ""); }}
                  className={`w-full text-left bg-white rounded-2xl shadow-sm border p-5 transition-all hover:shadow-md ${
                    selected?.id === app.id ? "border-orange-300 ring-1 ring-orange-200" : "border-gray-100"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {app.user.firstName} {app.user.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{app.user.email}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {app.employerName} · {app.employmentYears}yr · {fmt(app.annualIncome)}/yr
                      </p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${config.color}`}>
                      {config.icon} {app.status.replace("_", " ")}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-6">
            <h3 className="font-semibold text-gray-800">
              {selected.user.firstName} {selected.user.lastName}
            </h3>
            <p className="text-sm text-gray-500">{selected.user.email}</p>
            {selected.user.phone && <p className="text-sm text-gray-400">{selected.user.phone}</p>}

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">💰 Income</span>
                <span className="font-medium">{fmt(selected.annualIncome)}/yr</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">💼 Employer</span>
                <span className="font-medium">{selected.employerName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">📅 Tenure</span>
                <span className="font-medium">{selected.employmentYears} years</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">🏡 Housing</span>
                <span className="font-medium">{selected.housingStatus} · {fmt(selected.monthlyHousing)}/mo</span>
              </div>
            </div>

            {/* Documents */}
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Documents</p>
              {selected.user.documents.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No documents uploaded yet</p>
              ) : (
                <div className="space-y-1.5">
                  {selected.user.documents.map((doc, i) => {
                    const dConfig = docStatusConfig[doc.status] || docStatusConfig.PENDING;
                    return (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 truncate">{doc.type.replace(/_/g, " ")}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${dConfig.color}`}>
                          {dConfig.icon} {doc.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Actions */}
            {selected.status === "SUBMITTED" && (
              <div className="mt-6 space-y-3">
                <textarea
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  rows={2}
                  placeholder="Review notes (optional)..."
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmAction({ id: selected.id, status: "APPROVED", label: "Approve this application?", variant: "default" })}
                    disabled={updating}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white font-medium text-sm hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => setConfirmAction({ id: selected.id, status: "NEEDS_INFO", label: "Request more information?", variant: "warning" })}
                    disabled={updating}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 text-white font-medium text-sm hover:bg-amber-600 transition-colors disabled:opacity-50"
                  >
                    🤔 Info
                  </button>
                  <button
                    onClick={() => setConfirmAction({ id: selected.id, status: "DENIED", label: "Deny this application? This cannot be undone.", variant: "danger" })}
                    disabled={updating}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    ❌ Deny
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {confirmAction && (
        <ConfirmDialog
          open={!!confirmAction}
          onOpenChange={(open) => { if (!open) setConfirmAction(null); }}
          title={confirmAction.status === "APPROVED" ? "Approve Application" : confirmAction.status === "DENIED" ? "Deny Application" : "Request Info"}
          description={confirmAction.label}
          confirmLabel={confirmAction.status === "APPROVED" ? "Approve" : confirmAction.status === "DENIED" ? "Deny" : "Request"}
          variant={confirmAction.variant}
          onConfirm={() => handleAction(confirmAction.id, confirmAction.status)}
          loading={updating}
        />
      )}
    </div>
  );
}
