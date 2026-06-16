import Anthropic from "@anthropic-ai/sdk";

export const MODEL = "claude-haiku-4-5-20251001";

let client: Anthropic | null = null;

/**
 * Lazily instantiate the Anthropic client so a missing API key never crashes
 * the module at import time (e.g. during `next build`). The key is only ever
 * read on the server — never expose ANTHROPIC_API_KEY to the client.
 */
export function getAnthropic(): Anthropic {
  if (!client) {
    client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY ?? "",
    });
  }
  return client;
}

/**
 * Strip markdown code fences and parse JSON returned by the model.
 * Throws if the text is not valid JSON after cleaning.
 */
export function parseModelJson<T>(text: string): T {
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean) as T;
}
