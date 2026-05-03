# Pinecone

**What:** Hosted vector database for similarity search and RAG.

**Why chosen:** Mature, fast cold-start free index, simple SDK. The `pinecone` answer in the interview is opt-in because plenty of SaaS apps don't need vectors at all.

**Free tier:** One serverless index, 100k vectors, single region. Adequate for prototypes and small RAG features.

**Alternatives considered:** pgvector on Supabase (one less vendor, but operationally heavier at scale), Weaviate Cloud (more features, costlier at small scale), Qdrant Cloud (good alternative).

**Used in template by:**
- `packages/ai/src/pinecone.ts` — client + helpers for `upsert` / `query`
- `packages/ai/src/embeddings.ts` — wrapper around an embedding model (default: bring-your-own; OpenAI key is *not* part of the canonical stack)

**Env vars:**
- `PINECONE_API_KEY`
- `PINECONE_INDEX` — index name
- `OPENAI_API_KEY` — only if you embed via OpenAI

**Setup:**
1. Create a serverless index. Pick a dimension matching your embedding model (e.g. 1536 for `text-embedding-3-small`).
2. Copy API key.

**Skipping:** Deselect `pinecone` in the interview. The `packages/ai/` folder still exists but exports become no-ops.
