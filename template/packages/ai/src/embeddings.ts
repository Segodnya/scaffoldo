import { AppError } from '@__PROJECT_SLUG__/core';

/**
 * Embed a string with OpenAI. The OpenAI SDK is intentionally not a hard
 * dependency — call this only when you've installed `openai` and set
 * OPENAI_API_KEY. Swap implementations freely.
 */
export const embedText = async (text: string): Promise<number[]> => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new AppError('external_service_failed', 'OPENAI_API_KEY missing — cannot embed.');
  }

  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: 'text-embedding-3-small', input: text }),
  });
  if (!res.ok) {
    throw new AppError('external_service_failed', `OpenAI embeddings: ${res.status}`);
  }
  const json = (await res.json()) as { data: Array<{ embedding: number[] }> };
  if (!json.data[0]) throw new AppError('external_service_failed', 'OpenAI returned no embedding.');
  return json.data[0].embedding;
};
