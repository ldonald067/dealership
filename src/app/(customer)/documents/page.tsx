"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";

interface Doc {
  id: string;
  type: string;
  fileName: string;
  fileSize: number;
  status: string;
  reviewNote: string | null;
  uploadedAt: string;
}

const docTypes = [
  {
    type: "DRIVERS_LICENSE",
    label: "Driver's License",
    icon: "🪪",
    description: "Front and back of your valid driver's license",
  },
  {
    type: "PROOF_OF_INSURANCE",
    label: "Proof of Insurance",
    icon: "🛡️",
    description: "Current auto insurance declaration page",
  },
  {
    type: "PROOF_OF_INCOME",
    label: "Proof of Income",
    icon: "💰",
    description: "Recent pay stub or tax return",
  },
  {
    type: "TRADE_IN_PHOTO",
    label: "Trade-In Photos",
    icon: "📸",
    description: "Photos of your current vehicle (if trading in)",
  },
];

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const fetchDocs = useCallback(() => {
    fetch("/api/documents")
      .then((r) => r.json())
      .then(setDocuments);
  }, []);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  async function handleUpload(file: File, type: string) {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Maximum file size is 10MB. Try compressing or using a different file.",
      });
      return;
    }

    setUploading(type);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        toast.success("Uploaded!", {
          description: `${file.name} is now pending review.`,
        });
        fetchDocs();
      } else {
        toast.error("Upload failed", {
          description: "Something went wrong. Please try again.",
        });
      }
    } catch {
      toast.error("Connection error", {
        description: "Check your internet and try again.",
      });
    } finally {
      setUploading(null);
    }
  }

  function getDocsForType(type: string) {
    return documents.filter((d) => d.type === type);
  }

  const statusConfig: Record<string, { color: string; icon: string }> = {
    PENDING: { color: "bg-amber-50 text-amber-700", icon: "⏳" },
    APPROVED: { color: "bg-emerald-50 text-emerald-700", icon: "✅" },
    REJECTED: { color: "bg-red-50 text-red-700", icon: "❌" },
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <div className="flex items-center gap-4">
        <img src="/illustrations/folder1.png" alt="" width={64} height={48} className="shrink-0 hidden sm:block" />
        <div>
          <h1 className="text-2xl font-bold text-teal-800">Upload Documents</h1>
          <p className="text-gray-500 mt-1">
            Get your paperwork ready ahead of time — no scrambling at the dealership
          </p>
        </div>
      </div>

      <div className="space-y-5 mt-8">
        {docTypes.map((dt) => {
          const docs = getDocsForType(dt.type);
          const isUploading = uploading === dt.type;
          const isDraggedOver = dragOver === dt.type;

          return (
            <div
              key={dt.type}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{dt.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{dt.label}</h3>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {dt.description}
                    </p>
                  </div>
                  {docs.length > 0 && (
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${
                        statusConfig[docs[0].status]?.color || "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {statusConfig[docs[0].status]?.icon} {docs[0].status}
                    </span>
                  )}
                </div>

                {/* Uploaded files */}
                {docs.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {docs.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 text-sm"
                      >
                        <span className="text-gray-400">📎</span>
                        <span className="flex-1 text-gray-700 truncate">
                          {doc.fileName}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {formatBytes(doc.fileSize)}
                        </span>
                      </div>
                    ))}
                    {docs[0].status === "REJECTED" && docs[0].reviewNote && (
                      <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-red-50 text-sm">
                        <span>💬</span>
                        <p className="text-red-600">
                          {docs[0].reviewNote}
                        </p>
                      </div>
                    )}
                    {docs[0].status !== "REJECTED" && docs[0].reviewNote && (
                      <p className="text-sm text-gray-500 italic px-3">
                        Note: {docs[0].reviewNote}
                      </p>
                    )}
                  </div>
                )}

                {/* Upload zone */}
                <label
                  className={`mt-4 flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                    isDraggedOver
                      ? "border-orange-400 bg-orange-50 scale-[1.01]"
                      : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/30"
                  } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(dt.type);
                  }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(null);
                    const file = e.dataTransfer.files[0];
                    if (file) handleUpload(file, dt.type);
                  }}
                >
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(file, dt.type);
                    }}
                  />
                  {isUploading ? (
                    <div className="flex items-center gap-3">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                      <p className="text-sm text-orange-600 font-medium">Uploading...</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-400">
                        <span className="text-orange-600 font-medium">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-300 mt-1">
                        PDF, PNG, JPG up to 10MB
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>
          );
        })}
      </div>
      {/* Next step nudge */}
      {documents.filter((d) => d.status === "APPROVED").length >= 2 && (
        <Link href="/credit" className="group block mt-8">
          <div className="bg-teal-800 rounded-2xl p-5 flex items-center gap-4 text-white hover:bg-teal-700 transition-colors">
            <span className="text-2xl">🪙</span>
            <div className="flex-1">
              <p className="font-bold">Docs looking good! Next: get pre-approved</p>
              <p className="text-teal-200 text-sm">Takes 2 minutes, won&apos;t affect your credit score</p>
            </div>
            <span className="text-teal-300 group-hover:translate-x-1 transition-transform text-lg">→</span>
          </div>
        </Link>
      )}
    </div>
  );
}
