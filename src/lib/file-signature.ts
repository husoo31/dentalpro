// Client-supplied Content-Type (File.type) is attacker-controlled and easy to spoof, so it
// must never be the sole gate before writing a file into the statically-served public/
// directory. This checks the actual bytes against known image magic numbers instead.
export type DetectedImageType = "jpeg" | "png" | "webp";

const SIGNATURES: { type: DetectedImageType; ext: string; matches: (b: Buffer) => boolean }[] = [
  {
    type: "jpeg",
    ext: ".jpg",
    matches: (b) => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    type: "png",
    ext: ".png",
    matches: (b) =>
      b.length >= 8 &&
      b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 &&
      b[4] === 0x0d && b[5] === 0x0a && b[6] === 0x1a && b[7] === 0x0a,
  },
  {
    type: "webp",
    ext: ".webp",
    matches: (b) =>
      b.length >= 12 &&
      b.toString("ascii", 0, 4) === "RIFF" &&
      b.toString("ascii", 8, 12) === "WEBP",
  },
];

/**
 * Returns the detected image type/extension from the file's actual bytes, or null if it
 * doesn't match any allowed signature. The caller should use the returned extension for the
 * saved filename rather than anything derived from the client-supplied name or MIME type.
 */
export function detectImageSignature(buffer: Buffer): { type: DetectedImageType; ext: string } | null {
  for (const sig of SIGNATURES) {
    if (sig.matches(buffer)) {
      return { type: sig.type, ext: sig.ext };
    }
  }
  return null;
}
