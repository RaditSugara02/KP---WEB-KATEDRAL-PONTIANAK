import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";
import sharp from "sharp";

const BUCKET = "katedral-media";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars not configured");
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function POST(req: NextRequest) {
  try {
    // Auth check — admin dan couple
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "COUPLE")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file" }, { status: 400 });
    }

    // Validate type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipe file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF." },
        { status: 400 }
      );
    }

    // Max 10MB (kita kompres, jadi naikkan limit sedikit untuk kenyamanan upload)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 10MB." },
        { status: 400 }
      );
    }

    const rawBuffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop() || "jpg";

    // ── Kompresi & konversi ke WebP via Sharp ──────────────────────────
    let uploadBuffer: Buffer;
    let uploadContentType: string;
    let uploadExt: string;

    // GIF: skip Sharp (animasi bisa rusak), upload langsung
    if (file.type === "image/gif") {
      uploadBuffer = rawBuffer;
      uploadContentType = "image/gif";
      uploadExt = "gif";
    } else {
      try {
        uploadBuffer = await sharp(rawBuffer)
          .resize(1920, 1920, {
            fit: "inside",           // jaga aspek rasio, tidak pernah upscale
            withoutEnlargement: true,
          })
          .webp({ quality: 82 })     // WebP quality 82 — optimal antara kualitas & ukuran
          .toBuffer();
        uploadContentType = "image/webp";
        uploadExt = "webp";
      } catch (sharpError) {
        // ── FALLBACK: Sharp gagal → upload file asli tanpa kompresi ──
        console.warn("[Upload] Sharp processing failed, uploading original:", sharpError);
        uploadBuffer = rawBuffer;
        uploadContentType = file.type;
        uploadExt = ext;
      }
    }

    const supabase = getSupabaseAdmin();

    // Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((b) => b.name === BUCKET);
    if (!bucketExists) {
      await supabase.storage.createBucket(BUCKET, { public: true });
    }

    // Generate unique filename
    const filename = `${nanoid()}.${uploadExt}`;
    const path = `uploads/${filename}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, uploadBuffer, {
        contentType: uploadContentType,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { error: "Gagal mengupload file ke storage." },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err) {
    console.error("Upload API error:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
