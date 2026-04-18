import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DealerDashboard() {
  const session = await auth();
  if (!session?.user?.dealershipId) redirect("/login");

  const dealershipId = session.user.dealershipId;

  const [pendingApps, todayAppts, vehicleCount, pendingDocs] = await Promise.all([
    prisma.creditApplication.count({ where: { status: "SUBMITTED" } }),
    prisma.appointment.count({
      where: {
        dealershipId,
        dateTime: {
          gte: new Date(new Date().toISOString().split("T")[0]),
          lt: new Date(new Date(Date.now() + 86400000).toISOString().split("T")[0]),
        },
      },
    }),
    prisma.vehicle.count({ where: { dealershipId, status: "AVAILABLE" } }),
    prisma.document.count({ where: { status: "PENDING" } }),
  ]);

  const recentAppts = await prisma.appointment.findMany({
    where: { dealershipId, dateTime: { gte: new Date() } },
    include: {
      user: { select: { firstName: true, lastName: true } },
      vehicle: { select: { year: true, make: true, model: true } },
    },
    orderBy: { dateTime: "asc" },
    take: 5,
  });

  const cards = [
    { label: "Pending Applications", value: pendingApps, color: "text-orange-500", href: "/dealer/applications", icon: "🔍" },
    { label: "Today's Appointments", value: todayAppts, color: "text-rose-500", href: "/dealer/calendar", icon: "🗓️" },
    { label: "Vehicles in Stock", value: vehicleCount, color: "text-emerald-500", href: "/dealer/inventory", icon: "🏎️" },
    { label: "Docs to Review", value: pendingDocs, color: "text-violet-500", href: "/dealer/applications", icon: "🗂️" },
  ];

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-3xl font-bold text-gray-800">Dealer Dashboard</h1>
      <p className="text-gray-500 mt-2">
        Welcome back, {session.user.name}. Here&apos;s what needs your attention.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-200/50 hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 font-medium">{card.label}</p>
                <span className="text-lg" aria-hidden="true">{card.icon}</span>
              </div>
              <p className={`text-3xl font-bold mt-2 ${card.color}`}>{card.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Upcoming appointments */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h2>
          <Link href="/dealer/calendar" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
            View all →
          </Link>
        </div>
        {recentAppts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-gray-200">
            <p className="text-gray-400">No upcoming appointments</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentAppts.map((apt) => (
              <div key={apt.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">
                    {apt.user.firstName} {apt.user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(apt.dateTime).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    {" at "}
                    {new Date(apt.dateTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                  </p>
                </div>
                <div className="text-right">
                  {apt.vehicle && (
                    <p className="text-sm text-gray-600">
                      {apt.vehicle.year} {apt.vehicle.make} {apt.vehicle.model}
                    </p>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    apt.status === "CONFIRMED" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                  }`}>
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
