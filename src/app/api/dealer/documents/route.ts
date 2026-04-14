import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "DEALER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, status, reviewNote } = await req.json();

  const updated = await prisma.document.update({
    where: { id },
    data: {
      status,
      reviewNote: reviewNote || null,
      reviewedAt: new Date(),
    },
  });

  return NextResponse.json(updated);
}
