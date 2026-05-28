import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy download route — fetches the image server-side and returns it
 * with Content-Disposition: attachment so the browser downloads it instead
 * of opening it in a new tab.
 *
 * Usage: /api/public/galeri/download?url=<encoded_image_url>&filename=<name>
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const imageUrl = searchParams.get("url");
  const filename = searchParams.get("filename") || "foto-katedral";

  if (!imageUrl) {
    return NextResponse.json({ error: "url diperlukan" }, { status: 400 });
  }

  // Only allow https URLs (security: no local file:// etc.)
  if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
    return NextResponse.json({ error: "URL tidak valid" }, { status: 400 });
  }

  try {
    const imageRes = await fetch(imageUrl, {
      headers: { "User-Agent": "KatedralBot/1.0" },
    });

    if (!imageRes.ok) {
      return NextResponse.json(
        { error: "Gagal mengambil gambar" },
        { status: 502 }
      );
    }

    const contentType = imageRes.headers.get("content-type") || "image/jpeg";
    const buffer = await imageRes.arrayBuffer();

    // Determine extension from content type
    const ext = contentType.includes("png")
      ? "png"
      : contentType.includes("webp")
      ? "webp"
      : contentType.includes("gif")
      ? "gif"
      : "jpg";

    const safeFilename = `${filename}.${ext}`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${safeFilename}"`,
        "Content-Length": String(buffer.byteLength),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengunduh gambar" },
      { status: 500 }
    );
  }
}
