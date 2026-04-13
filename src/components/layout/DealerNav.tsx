"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

const navItems = [
  { href: "/dealer/dashboard", label: "Dashboard", icon: "📡" },
  { href: "/dealer/applications", label: "Applications", icon: "🔍" },
  { href: "/dealer/inventory", label: "Inventory", icon: "🏎️" },
  { href: "/dealer/calendar", label: "Calendar", icon: "🗓️" },
  { href: "/dealer/settings", label: "Settings", icon: "🔧" },
];

export function DealerNav() {
  const pathname = usePathname();
  const [showSignOut, setShowSignOut] = useState(false);

  return (
    <>
    <nav className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="p-6">
        <Link href="/dealer/dashboard" className="block">
          <h2 className="text-xl font-bold text-gray-800">
            DriveReady
          </h2>
          <p className="text-xs text-orange-500 font-medium mt-0.5">Dealer Portal</p>
        </Link>
      </div>

      <div className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-orange-50 text-orange-700 border border-orange-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-100">
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
      title="Sign out of Dealer Portal?"
      description="You'll need to log back in to manage applications and appointments."
      confirmLabel="Sign out"
      cancelLabel="Stay"
      variant="danger"
      onConfirm={() => signOut({ callbackUrl: "/" })}
    />
    </>
  );
}
