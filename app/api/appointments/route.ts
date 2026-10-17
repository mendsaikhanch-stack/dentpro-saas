import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendAppointmentSMS } from "@/lib/sms";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  const appointments = await prisma.appointment.findMany({
    where: date ? { date } : undefined,
    include: { patient: true, doctor: true },
    orderBy: [{ date: "desc" }, { time: "asc" }],
  });

  return NextResponse.json(appointments);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const appointment = await prisma.appointment.create({
      data,
      include: { patient: true, doctor: true },
    });

    // SMS илгээх (алдаа гарсан ч appointment амжилттай буцаана)
    try {
      if (appointment.patient.phone) {
        await sendAppointmentSMS(
          appointment.patient.phone,
          appointment.date,
          appointment.time,
          appointment.doctor.name
        );
      }
    } catch (smsError) {
      console.error("[SMS] Алдаа:", smsError);
    }

    return NextResponse.json(appointment);
  } catch {
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
