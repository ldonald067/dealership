import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "DEALER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dealershipId = session.user.dealershipId;
  if (!dealershipId) {
    return NextResponse.json({ error: "No dealership" }, { status: 400 });
  }

  const appointments = await prisma.appointment.findMany({
    where: { dealershipId },
    include: {
      user: { select: { firstName: true, lastName: true, email: true, phone: true } },
      vehicle: { select: { year: true, make: true, model: true, trim: true } },
    },
    orderBy: { dateTime: "asc" },
  });

  return NextResponse.json(appointments);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "DEALER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status } = await req.json();

  const updated = await prisma.appointment.update({
    where: { id },
    data: { status, updatedAt: new Date() },
  });

  return NextResponse.json(updated);
}
