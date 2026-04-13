import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appointments = await prisma.appointment.findMany({
    where: { userId: session.user.id },
    include: {
      dealership: { select: { name: true, address: true, city: true, state: true } },
      vehicle: { select: { year: true, make: true, model: true, trim: true } },
    },
    orderBy: { dateTime: "asc" },
  });

  return NextResponse.json(appointments);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const appointment = await prisma.appointment.create({
    data: {
      userId: session.user.id,
      dealershipId: body.dealershipId,
      vehicleId: body.vehicleId || null,
      dateTime: new Date(body.dateTime),
      purpose: body.purpose || "TEST_DRIVE_AND_SIGN",
      notes: body.notes || null,
    },
    include: {
      dealership: { select: { name: true } },
      vehicle: { select: { year: true, make: true, model: true } },
    },
  });

  return NextResponse.json(appointment, { status: 201 });
}
