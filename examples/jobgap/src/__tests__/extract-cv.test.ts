/**
 * Tests for /app/api/extract-cv validation (400 / 422 paths) + DOCX extraction.
 * unpdf is mocked so no real PDF engine loads; mammoth runs for real on the fixture.
 */

import { NextRequest } from "next/server";
import { POST } from "@/app/api/extract-cv/route";

// Mock unpdf so tests don't load a PDF engine
jest.mock("unpdf", () => ({
  extractText: jest.fn(),
}));
import { extractText } from "unpdf";
const mockExtractText = extractText as jest.Mock;

// Helper: build a NextRequest with a multipart body containing one file
function makeRequest(file: File): NextRequest {
  const form = new FormData();
  form.append("file", file);
  return new NextRequest("http://localhost/api/extract-cv", {
    method: "POST",
    body: form,
  });
}

// Helper: build a fake File
function fakeFile(opts: { name?: string; type?: string; size?: number; content?: string }) {
  const content = opts.content ?? "x".repeat(opts.size ?? 10);
  return new File([content], opts.name ?? "cv.pdf", { type: opts.type ?? "application/pdf" });
}

describe("POST /api/extract-cv — 400 validation", () => {
  it("returns 400 when no file field is present", async () => {
    const req = new NextRequest("http://localhost/api/extract-cv", {
      method: "POST",
      body: new FormData(), // empty form
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/no file/i);
  });

  it("returns 400 when file is an unsupported type (e.g. .txt)", async () => {
    const file = fakeFile({ name: "cv.txt", type: "text/plain" });
    const res = await POST(makeRequest(file));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/pdf and docx/i);
  });

  it("returns 400 when file exceeds 2 MB", async () => {
    const big = fakeFile({ size: 2 * 1024 * 1024 + 1 });
    const res = await POST(makeRequest(big));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/2 mb/i);
  });
});

describe("POST /api/extract-cv — 422 validation", () => {
  it("returns 422 when extracted text is under 200 characters", async () => {
    mockExtractText.mockResolvedValueOnce({ totalPages: 1, text: "Too short." });
    const file = fakeFile({ content: "%PDF-1.4 fake" });
    const res = await POST(makeRequest(file));
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toMatch(/scanned/i);
  });

  it("returns 200 with text when extraction succeeds", async () => {
    const longText = "A".repeat(300);
    mockExtractText.mockResolvedValueOnce({ totalPages: 1, text: longText });
    const file = fakeFile({ content: "%PDF-1.4 fake" });
    const res = await POST(makeRequest(file));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.text).toBe(longText);
  });
});

describe("POST /api/extract-cv — DOCX extraction", () => {
  it("extracts text from a real DOCX fixture and returns 200", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const fixturePath = path.join(__dirname, "fixtures/sample.docx");
    const buf = fs.readFileSync(fixturePath);
    const file = new File(
      [buf],
      "sample.docx",
      { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
    );
    const res = await POST(makeRequest(file));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(typeof body.text).toBe("string");
    expect(body.text.length).toBeGreaterThan(200);
    expect(body.text).toContain("Budi Santoso");
  });
});
