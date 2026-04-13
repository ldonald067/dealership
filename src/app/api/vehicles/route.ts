import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const make = searchParams.get("make");
  const bodyType = searchParams.get("bodyType");
  const fuelType = searchParams.get("fuelType");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const where: Record<string, unknown> = {
    status: "AVAILABLE",
  };

  if (make) where.make = make;
  if (bodyType) where.bodyType = bodyType;
  if (fuelType) where.fuelType = fuelType;
  if (minPrice || maxPrice) {
    where.msrp = {
      ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
      ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
    };
  }

  const vehicles = await prisma.vehicle.findMany({
    where,
    include: { dealership: { select: { id: true, name: true, city: true, state: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(vehicles);
}
