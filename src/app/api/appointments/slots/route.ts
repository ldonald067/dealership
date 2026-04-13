import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dealershipId = searchParams.get("dealershipId");
  const date = searchParams.get("date");

  if (!dealershipId || !date) {
    return NextResponse.json({ error: "dealershipId and date required" }, { status: 400 });
  }

  const dateObj = new Date(date);
  const dayOfWeek = dateObj.getDay();

  const slots = await prisma.timeSlot.findMany({
    where: { dealershipId, dayOfWeek },
    orderBy: { startTime: "asc" },
  });

  // Check existing bookings for this date
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const bookings = await prisma.appointment.findMany({
    where: {
      dealershipId,
      dateTime: { gte: startOfDay, lte: endOfDay },
      status: { not: "CANCELLED" },
    },
  });

  const availableSlots = slots.map((slot) => {
    const booked = bookings.filter((b) => {
      const hours = b.dateTime.getHours().toString().padStart(2, "0");
      const mins = b.dateTime.getMinutes().toString().padStart(2, "0");
      return `${hours}:${mins}` === slot.startTime;
    }).length;

    return {
      ...slot,
      available: booked < slot.maxBookings,
      remaining: slot.maxBookings - booked,
    };
  });

  return NextResponse.json(availableSlots);
}
