/**
 * Unit tests for lib/gemini.ts retry logic.
 * @google/genai is mocked; no real HTTP calls are made.
 */

import { callGeminiWithRetry, GeminiBusyError, analyzeWithGemini } from "@/lib/gemini";

// ── Mock @google/genai ────────────────────────────────────────────────────

const mockGenerateContent = jest.fn();

jest.mock("@google/genai", () => {
  const Type = {
    OBJECT: "OBJECT",
    ARRAY: "ARRAY",
    STRING: "STRING",
    NUMBER: "NUMBER",
    INTEGER: "INTEGER",
    BOOLEAN: "BOOLEAN",
  };
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => ({
      models: { generateContent: mockGenerateContent },
    })),
    Type,
  };
});

// ── Helpers ───────────────────────────────────────────────────────────────

const VALID_LLM = {
  matched_skills: ["TypeScript", "React"],
  missing_skills: [{ skill: "Docker", priority: "high" }],
  learning_plan: [
    { skill: "Docker", action: "Do tutorial", resource_type: "video", est_hours: 4 },
  ],
};

function successResponse() {
  return { text: JSON.stringify(VALID_LLM) };
}

function apiError(status: number) {
  return new Error(`Request failed with status ${status}`);
}

// Speed up: replace sleep with a no-op
jest.mock("@/lib/gemini", () => {
  // We want to test the real module but patch `sleep` to be instant.
  // Re-require after patching global setTimeout is easier via jest.useFakeTimers,
  // but the cleanest approach for a unit test is to just use real timers and
  // keep backoff tiny. Instead, we re-export and spy.
  const real = jest.requireActual("@/lib/gemini");
  return real;
});

// Override sleep by replacing global setTimeout for the duration of tests
beforeAll(() => jest.useFakeTimers());
afterAll(() => jest.useRealTimers());
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

// Advance all timers after each promise tick so backoff doesn't stall tests
async function flushTimers() {
  // Run microtasks, then advance timers, then microtasks again
  await Promise.resolve();
  jest.runAllTimers();
  await Promise.resolve();
  jest.runAllTimers();
  await Promise.resolve();
}

// ── Tests: callGeminiWithRetry ────────────────────────────────────────────

describe("callGeminiWithRetry", () => {
  it("returns parsed result on first success", async () => {
    mockGenerateContent.mockResolvedValueOnce(successResponse());
    const result = await callGeminiWithRetry("prompt", "model-a", "key");
    expect(result).toEqual(VALID_LLM);
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
  });

  it("retries on 503 and succeeds on second attempt", async () => {
    mockGenerateContent
      .mockRejectedValueOnce(apiError(503))
      .mockResolvedValueOnce(successResponse());

    const promise = callGeminiWithRetry("prompt", "model-a", "key");
    await flushTimers();
    const result = await promise;
    expect(result).toEqual(VALID_LLM);
    expect(mockGenerateContent).toHaveBeenCalledTimes(2);
  });

  it("retries on 429 and succeeds on third attempt", async () => {
    mockGenerateContent
      .mockRejectedValueOnce(apiError(429))
      .mockRejectedValueOnce(apiError(429))
      .mockResolvedValueOnce(successResponse());

    const promise = callGeminiWithRetry("prompt", "model-a", "key");
    await flushTimers();
    await flushTimers();
    const result = await promise;
    expect(result).toEqual(VALID_LLM);
    expect(mockGenerateContent).toHaveBeenCalledTimes(3);
  });

  it("throws after 3 failed attempts on 503", async () => {
    mockGenerateContent
      .mockRejectedValueOnce(apiError(503))
      .mockRejectedValueOnce(apiError(503))
      .mockRejectedValueOnce(apiError(503));

    const promise = callGeminiWithRetry("prompt", "model-a", "key");
    await flushTimers();
    await flushTimers();
    await expect(promise).rejects.toThrow("503");
    expect(mockGenerateContent).toHaveBeenCalledTimes(3);
  });

  it("does NOT retry on 400 bad-request errors", async () => {
    mockGenerateContent.mockRejectedValueOnce(apiError(400));
    await expect(
      callGeminiWithRetry("prompt", "model-a", "key")
    ).rejects.toThrow("400");
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
  });
});

// ── Tests: analyzeWithGemini (fallback) ────────────────────────────────────

describe("analyzeWithGemini", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = {
      ...OLD_ENV,
      GEMINI_API_KEY: "test-key",
      GEMINI_MODEL: "primary-model",
      GEMINI_FALLBACK_MODEL: "fallback-model",
    };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it("returns result from primary model when it succeeds", async () => {
    mockGenerateContent.mockResolvedValueOnce(successResponse());
    const result = await analyzeWithGemini("prompt");
    expect(result).toEqual(VALID_LLM);
  });

  it("falls back to fallback model when primary exhausts retries", async () => {
    // Primary fails 3× then fallback succeeds
    mockGenerateContent
      .mockRejectedValueOnce(apiError(503))
      .mockRejectedValueOnce(apiError(503))
      .mockRejectedValueOnce(apiError(503))
      .mockResolvedValueOnce(successResponse());

    const promise = analyzeWithGemini("prompt");
    // Drain primary retries
    await flushTimers();
    await flushTimers();
    const result = await promise;
    expect(result).toEqual(VALID_LLM);
  });

  it("throws GeminiBusyError when both primary and fallback fail", async () => {
    // Primary 3× + fallback 3× all fail
    mockGenerateContent.mockRejectedValue(apiError(503));

    const promise = analyzeWithGemini("prompt");
    await flushTimers();
    await flushTimers();
    await flushTimers();
    await flushTimers();
    await flushTimers();
    await flushTimers();
    await expect(promise).rejects.toBeInstanceOf(GeminiBusyError);
  });
});
