import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get("patientId");

  if (!patientId) {
    return NextResponse.json({ error: "patientId шаардлагатай" }, { status: 400 });
  }

  const photos = await prisma.photo.findMany({
    where: { patientId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(photos);
}

export async function POST(request: Request) {
  try {
    const { url, description, patientId, treatmentId } = await request.json();

    if (!url || !patientId) {
      return NextResponse.json(
        { error: "url болон patientId шаардлагатай" },
        { status: 400 }
      );
    }

    const photo = await prisma.photo.create({
      data: {
        url,
        description: description || null,
        patientId,
        treatmentId: treatmentId || null,
      },
    });

    return NextResponse.json(photo);
  } catch {
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
