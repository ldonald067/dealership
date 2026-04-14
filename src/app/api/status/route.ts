import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [documents, creditApps, appointments] = await Promise.all([
    prisma.document.findMany({
      where: { userId: session.user.id },
      select: { type: true, status: true },
    }),
    prisma.creditApplication.findMany({
      where: { userId: session.user.id },
      orderBy: { submittedAt: "desc" },
      take: 1,
      select: { status: true, submittedAt: true },
    }),
    prisma.appointment.findMany({
      where: { userId: session.user.id },
      orderBy: { dateTime: "asc" },
      take: 1,
      include: {
        dealership: { select: { name: true } },
        vehicle: { select: { year: true, make: true, model: true } },
      },
    }),
  ]);

  return NextResponse.json({ documents, creditApps, appointments });
}
