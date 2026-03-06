import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const treatments = await prisma.treatment.findMany({
    include: { patient: true, doctor: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(treatments);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const treatment = await prisma.treatment.create({
      data: {
        ...data,
        cost: parseFloat(data.cost) || 0,
      },
      include: { patient: true, doctor: true },
    });
    return NextResponse.json(treatment);
  } catch {
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
