import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "DEALER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get all customers who have credit apps, with their documents
  const apps = await prisma.creditApplication.findMany({
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          documents: {
            select: { type: true, status: true, fileName: true },
          },
        },
      },
    },
    orderBy: { submittedAt: "desc" },
  });

  return NextResponse.json(apps);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "DEALER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status, reviewNote } = await req.json();

  const updated = await prisma.creditApplication.update({
    where: { id },
    data: {
      status,
      reviewNote: reviewNote || null,
      reviewedAt: new Date(),
    },
  });

  return NextResponse.json(updated);
}
