import { GoogleGenAI } from "@google/genai";

// Fast, low-cost Gemini model. Swap for "gemini-2.5-pro" for higher quality.
export const MODEL = "gemini-2.5-flash";

let client: GoogleGenAI | null = null;

/**
 * Lazily instantiate the Gemini client so a missing API key never crashes
 * the module at import time (e.g. during `next build`). The key is only ever
 * read on the server — never expose GEMINI_API_KEY to the client.
 */
export function getGemini(): GoogleGenAI {
  if (!client) {
    client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY ?? "",
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

/**
 * Send a single prompt to Gemini and parse the JSON response. The model is
 * asked for `application/json`, so output comes back without markdown fences;
 * parseModelJson still strips any stray fences defensively.
 */
export async function generateJson<T>(
  prompt: string,
  maxOutputTokens: number
): Promise<T> {
  const response = await getGemini().models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      maxOutputTokens,
      responseMimeType: "application/json",
      // Disable "thinking" — these are deterministic JSON-extraction calls, so
      // spending the token budget on internal reasoning would risk an empty
      // response. Flash supports a 0 budget; this is also faster and cheaper.
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  return parseModelJson<T>(response.text ?? "");
}
