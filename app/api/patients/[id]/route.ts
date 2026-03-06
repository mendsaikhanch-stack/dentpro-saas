import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      appointments: { include: { doctor: true }, orderBy: { date: "desc" } },
      treatments: { include: { doctor: true }, orderBy: { createdAt: "desc" } },
      photos: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!patient) {
    return NextResponse.json({ error: "Өвчтөн олдсонгүй" }, { status: 404 });
  }

  return NextResponse.json(patient);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const data = await request.json();
    const patient = await prisma.patient.update({ where: { id }, data });
    return NextResponse.json(patient);
  } catch {
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.patient.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
