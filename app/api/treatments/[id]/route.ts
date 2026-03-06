import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const treatment = await prisma.treatment.findUnique({
    where: { id },
    include: { patient: true, doctor: true, appointment: true },
  });

  if (!treatment) {
    return NextResponse.json({ error: "Олдсонгүй" }, { status: 404 });
  }

  return NextResponse.json(treatment);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const data = await request.json();
    if (data.cost) data.cost = parseFloat(data.cost);
    const treatment = await prisma.treatment.update({ where: { id }, data });
    return NextResponse.json(treatment);
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
    await prisma.treatment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
