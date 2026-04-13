"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { CustomerNav } from "@/components/layout/CustomerNav";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Find current page label for mobile header
  const pages: Record<string, string> = {
    "/dashboard": "Home",
    "/vehicles": "Browse Cars",
    "/documents": "Documents",
    "/credit": "Credit App",
    "/appointments": "Appointments",
    "/status": "My Status",
  };
  const currentPage = Object.entries(pages).find(([path]) =>
    pathname === path || pathname.startsWith(path + "/")
  )?.[1] || "DriveReady";

  return (
    <div className="flex h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-shrink-0">
        <CustomerNav />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile slide-out */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 z-50 md:hidden transform transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <CustomerNav mobile onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200/60">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="5" x2="17" y2="5" />
              <line x1="3" y1="10" x2="17" y2="10" />
              <line x1="3" y1="15" x2="17" y2="15" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-gray-700">{currentPage}</span>
          <span className="text-lg font-black text-orange-500">DR</span>
        </header>

        <main id="main-content" className="flex-1 overflow-y-auto bg-amber-50/40">
          {children}
        </main>
      </div>
    </div>
  );
}
