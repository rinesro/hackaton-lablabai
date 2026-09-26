import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";
// mammoth ships no .d.ts; declare the shape we need
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mammoth = require("mammoth") as {
  extractRawText: (input: { buffer: Buffer }) => Promise<{ value: string }>;
};

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const MIN_CHARS = 200;

function isPdf(file: File) {
  return (
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  );
}

function isDocx(file: File) {
  return (
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.name.toLowerCase().endsWith(".docx")
  );
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

  if (!isPdf(file) && !isDocx(file)) {
    return NextResponse.json(
      { error: "Only PDF and DOCX files are accepted" },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File exceeds the 2 MB limit" }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  let text: string;

  try {
    if (isPdf(file)) {
      const uint8 = new Uint8Array(buffer);
      const result = await extractText(uint8, { mergePages: true });
      text = result.text as string;
    } else {
      const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
      text = result.value;
    }
  } catch {
    return NextResponse.json({ error: "Could not parse the file" }, { status: 422 });
  }

  if (text.trim().length < MIN_CHARS) {
    return NextResponse.json(
      {
        error:
          "Extracted text is too short — this may be a scanned or image-only file. Please paste your CV text instead.",
      },
      { status: 422 }
    );
  }

  return NextResponse.json({ text });
}
