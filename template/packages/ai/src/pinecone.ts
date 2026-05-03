import { Pinecone } from '@pinecone-database/pinecone';

let cached: Pinecone | undefined;

const client = (): Pinecone | null => {
  const apiKey = process.env.PINECONE_API_KEY;
  if (!apiKey) return null;
  if (!cached) cached = new Pinecone({ apiKey });
  return cached;
};

const index = () => {
  const c = client();
  const name = process.env.PINECONE_INDEX;
  if (!c || !name) return null;
  return c.index(name);
};

export interface VectorRecord {
  id: string;
  values: number[];
  metadata?: Record<string, string | number | boolean | string[]>;
}

export const upsertVectors = async (records: VectorRecord[]): Promise<void> => {
  const idx = index();
  if (!idx) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[ai] Pinecone not configured — skipping upsert.');
    }
    return;
  }
  await idx.upsert(records);
};

export const queryVectors = async (
  values: number[],
  topK = 10,
): Promise<Array<{ id: string; score: number }>> => {
  const idx = index();
  if (!idx) return [];
  const res = await idx.query({ vector: values, topK, includeMetadata: false });
  return (res.matches ?? []).map((m) => ({ id: m.id, score: m.score ?? 0 }));
};
