import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apps = await prisma.creditApplication.findMany({
    where: { userId: session.user.id },
    orderBy: { submittedAt: "desc" },
  });

  return NextResponse.json(apps);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const app = await prisma.creditApplication.create({
    data: {
      userId: session.user.id,
      annualIncome: body.annualIncome,
      employerName: body.employerName,
      employmentYears: body.employmentYears,
      housingStatus: body.housingStatus,
      monthlyHousing: body.monthlyHousing,
      ssnLastFour: body.ssnLastFour,
      dateOfBirth: new Date(body.dateOfBirth),
    },
  });

  return NextResponse.json(app, { status: 201 });
}
