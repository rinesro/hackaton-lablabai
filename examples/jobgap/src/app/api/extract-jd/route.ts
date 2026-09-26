import { NextRequest, NextResponse } from "next/server";
import { extractJdWithGemini, GeminiBusyError } from "@/lib/gemini";

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB

const ACCEPTED: Record<string, string> = {
  "image/png":  "image/png",
  "image/jpeg": "image/jpeg",
  "image/jpg":  "image/jpeg",
};

function mimeFromFile(file: File): string | null {
  const byMime = ACCEPTED[file.type];
  if (byMime) return byMime;
  // Fallback: check extension for browsers that send generic MIME
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "png")  return "image/png";
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  return null;
}

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const mimeType = mimeFromFile(file);
  if (!mimeType) {
    return NextResponse.json(
      { error: "Only PNG, JPG, or JPEG images are accepted" },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image exceeds the 4 MB limit" }, { status: 400 });
  }

  // Convert to base64 for the Gemini inlineData API
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  let jdForm;
  try {
    jdForm = await extractJdWithGemini(base64, mimeType);
  } catch (err) {
    if (err instanceof GeminiBusyError) {
      return NextResponse.json(
        { error: "The AI service is busy right now. Please try again in a minute." },
        { status: 503 }
      );
    }
    const msg = err instanceof Error ? err.message : "Extraction failed";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  // 422 if both jobTitle and requirements are empty (not a job posting)
  const hasPosting =
    (jdForm.jobTitle?.trim().length ?? 0) > 0 ||
    (jdForm.requirements?.trim().length ?? 0) > 0;
  if (!hasPosting) {
    return NextResponse.json(
      { error: "This image doesn't look like a job posting. Please upload a clear image of a job advertisement." },
      { status: 422 }
    );
  }

  return NextResponse.json(jdForm);
}
