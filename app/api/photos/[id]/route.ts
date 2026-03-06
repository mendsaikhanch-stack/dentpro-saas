import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const photo = await prisma.photo.findUnique({ where: { id } });
    if (!photo) {
      return NextResponse.json({ error: "Зураг олдсонгүй" }, { status: 404 });
    }

    // Delete file from disk
    const filePath = path.join(process.cwd(), "public", photo.url);
    try {
      await unlink(filePath);
    } catch {
      // File may already be deleted, continue
    }

    await prisma.photo.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Алдаа гарлаа" }, { status: 500 });
  }
}
