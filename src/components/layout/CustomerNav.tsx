"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const navItems = [
  { href: "/dashboard", label: "Home", icon: "🏡" },
  { href: "/vehicles", label: "Browse Cars", icon: "🏎️" },
  { href: "/documents", label: "Documents", icon: "🗂️" },
  { href: "/credit", label: "Credit App", icon: "🪙" },
  { href: "/appointments", label: "Appointments", icon: "🗓️" },
  { href: "/status", label: "My Status", icon: "🧭" },
];

export function CustomerNav({ mobile, onClose }: { mobile?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const [showSignOut, setShowSignOut] = useState(false);

  return (
    <>
      <nav className={`flex flex-col h-full bg-white ${mobile ? "" : "border-r border-gray-200/60"}`}>
        <div className="p-6 flex items-center justify-between">
          <Link href="/dashboard" className="block" onClick={onClose}>
            <h2 className="text-xl font-black text-orange-500">
              DriveReady
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Skip the wait</p>
          </Link>
          {mobile && (
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors text-lg"
              aria-label="Close menu"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-700"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-200/60">
          <button
            onClick={() => setShowSignOut(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full"
          >
            <span className="text-lg">✌️</span>
            Sign out
          </button>
        </div>
      </nav>
      <ConfirmDialog
        open={showSignOut}
        onOpenChange={setShowSignOut}
        title="Heading out?"
        description="Your progress is saved — you can pick up right where you left off."
        confirmLabel="Sign out"
        cancelLabel="Stay"
        variant="danger"
        onConfirm={() => signOut({ callbackUrl: "/" })}
      />
    </>
  );
}
