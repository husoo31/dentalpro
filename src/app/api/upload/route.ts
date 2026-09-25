import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { detectImageSignature } from "@/lib/file-signature";

// Generous for a logo/favicon/gallery/doctor-photo upload, small enough to keep a single
// request from exhausting memory or disk. public/uploads is served as static content, so
// anything written here becomes an immediately reachable URL.
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Reject oversized requests from the declared Content-Length before buffering the body
    // into memory. This header can be absent or wrong, so file.size below is a second,
    // authoritative check on what was actually received.
    const declaredLength = Number(req.headers.get("content-length"));
    if (Number.isFinite(declaredLength) && declaredLength > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "File too large" }, { status: 413 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "File too large" }, { status: 413 });
    }

    // MIME type check (client-supplied, kept as a cheap first filter; not trusted on its own)
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Content is validated against real image signatures rather than trusting file.type or
    // the client-supplied filename's extension — both are attacker-controlled, and this file
    // is about to be written into a statically-served directory.
    const signature = detectImageSignature(buffer);
    if (!signature) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Secure filename: random, with the extension forced from the detected content type
    // (never from the client-supplied name), so no uploaded content can be served as HTML.
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const safeFilename = `upload_${uniqueSuffix}${signature.ext}`;

    const uploadDir = path.join(process.cwd(), "public/uploads");

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, safeFilename);
    await writeFile(filepath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${safeFilename}`
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
