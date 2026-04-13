import { DealerNav } from "@/components/layout/DealerNav";

export default function DealerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <aside className="hidden md:flex w-64 flex-shrink-0">
        <DealerNav />
      </aside>
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}
