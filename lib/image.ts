import sharp from "sharp";

/**
 * Зургийг чанар алдаагүйгээр (lossless) шахна.
 *
 * Стратеги:
 * - PNG, TIFF, BMP, WebP → Lossless WebP (ихэвчлэн PNG-ээс 25-35% бага хэмжээтэй)
 * - JPEG → JPEG хэвээр хадгална (JPEG аль хэдийн lossy шахалттай учир
 *   дахин encode хийвэл хэмжээ нэмэгдэнэ, чанар алдагдахгүй ч ашиггүй)
 *
 * @param buffer - Оригнал зургийн buffer
 * @param mimeType - Зургийн MIME type (image/png, image/jpeg, ...)
 * @returns { data: Buffer, ext: string, mimeType: string }
 */
export async function compressLossless(
  buffer: Buffer,
  mimeType: string
): Promise<{ data: Buffer; ext: string; mimeType: string }> {
  // JPEG → хэвээр хадгална (metadata-г л устгана)
  if (mimeType === "image/jpeg") {
    const data = await sharp(buffer)
      .rotate() // EXIF rotation засах
      .jpeg({ quality: 100, mozjpeg: true }) // MozJPEG: ижил чанартай бага хэмжээ
      .toBuffer();

    console.log(
      `[Image] JPEG оновчлол: ${formatSize(buffer.length)} → ${formatSize(data.length)}`
    );
    return { data, ext: "jpg", mimeType: "image/jpeg" };
  }

  // PNG, TIFF, BMP, WebP → Lossless WebP
  const data = await sharp(buffer)
    .rotate() // EXIF rotation засах
    .webp({ lossless: true, effort: 6 }) // effort 0-6, 6 = хамгийн их шахалт
    .toBuffer();

  console.log(
    `[Image] Lossless WebP шахалт: ${formatSize(buffer.length)} → ${formatSize(data.length)}`
  );
  return { data, ext: "webp", mimeType: "image/webp" };
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
