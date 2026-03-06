import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";

  const patients = await prisma.patient.findMany({
    where: search
      ? {
          OR: [
            { firstName: { contains: search } },
            { lastName: { contains: search } },
            { phone: { contains: search } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(patients);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const patient = await prisma.patient.create({ data });
    return NextResponse.json(patient);
  } catch {
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
