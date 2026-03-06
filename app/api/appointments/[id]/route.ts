import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { patient: true, doctor: true, treatments: true },
  });

  if (!appointment) {
    return NextResponse.json({ error: "Олдсонгүй" }, { status: 404 });
  }

  return NextResponse.json(appointment);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const data = await request.json();
    const appointment = await prisma.appointment.update({ where: { id }, data });
    return NextResponse.json(appointment);
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
    await prisma.appointment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
