import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.dealershipId) redirect("/dealer/dashboard");

  const dealership = await prisma.dealership.findUnique({
    where: { id: session.user.dealershipId },
    include: {
      timeSlots: { orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }] },
      _count: { select: { vehicles: true, appointments: true, staff: true } },
    },
  });

  if (!dealership) redirect("/dealer/dashboard");

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Group time slots by day
  const slotsByDay = days.map((day, i) => ({
    day,
    slots: dealership.timeSlots.filter((s) => s.dayOfWeek === i),
  }));

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-800">Dealership Settings</h1>
      <p className="text-gray-500 mt-1">Manage your dealership information</p>

      {/* Info card */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <span className="text-xl">🏢</span> {dealership.name}
        </h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Address</p>
            <p className="text-gray-700">{dealership.address}</p>
            <p className="text-gray-700">{dealership.city}, {dealership.state} {dealership.zip}</p>
          </div>
          <div>
            <p className="text-gray-400">Contact</p>
            <p className="text-gray-700">{dealership.phone}</p>
            <p className="text-gray-700">{dealership.email}</p>
          </div>
        </div>

        <div className="flex gap-6 mt-6 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-500">{dealership._count.vehicles}</p>
            <p className="text-xs text-gray-400">Vehicles</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-rose-500">{dealership._count.appointments}</p>
            <p className="text-xs text-gray-400">Appointments</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-violet-500">{dealership._count.staff}</p>
            <p className="text-xs text-gray-400">Staff</p>
          </div>
        </div>
      </div>

      {/* Hours */}
      <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <span className="text-xl">🕐</span> Business Hours
        </h3>
        <div className="mt-4 space-y-2">
          {slotsByDay.map(({ day, slots }) => (
            <div key={day} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
              <span className="w-10 text-sm font-medium text-gray-500">{day}</span>
              {slots.length === 0 ? (
                <span className="text-sm text-gray-300">Closed</span>
              ) : (
                <span className="text-sm text-gray-700">
                  {slots[0].startTime} — {slots[slots.length - 1].endTime}
                  <span className="text-gray-400 ml-2">({slots.length} slots)</span>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
