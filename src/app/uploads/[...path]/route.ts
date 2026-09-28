import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readFile, stat } from "fs/promises";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;

  // Reject any segment that could escape UPLOAD_DIR (e.g. "..").
  if (segments.some((segment) => segment.includes("..") || segment.includes("/") || segment.includes("\\"))) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const filename = segments.join("/");
  const filepath = path.join(UPLOAD_DIR, filename);

  if (!filepath.startsWith(UPLOAD_DIR)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const fileStat = await stat(filepath);
    if (!fileStat.isFile()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const buffer = await readFile(filepath);
    const ext = path.extname(filepath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": String(fileStat.size),
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
