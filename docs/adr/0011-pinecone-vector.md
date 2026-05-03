# 0011. Pinecone for vector search

- **Status:** Accepted
- **Date:** 2026-05-03

## Context
Many SaaS products eventually need similarity search or RAG (search across user content, semantic deduplication, "related" suggestions). At v0 most don't. Wiring this in optimistically is worth it because the integration cost compounds if added late.

## Decision
Include a **Pinecone** integration in `packages/ai/`, opt-in via the interview. The package exposes `upsert(records)` and `query(text, k)` helpers; embeddings are produced via a swappable provider (default: OpenAI `text-embedding-3-small` if `OPENAI_API_KEY` is set, otherwise the helpers throw with a clear message).

When the user deselects `pinecone`, the package still exists but its calls become no-ops (return empty arrays / log warnings in dev).

## Consequences
**Positive:**
- One serverless index on the free tier handles prototype scale.
- Pinecone's SDK is small and stable.
- No DB extension hassles.

**Negative:**
- Vendor lock-in for embeddings + index. Migration to pgvector later means re-embedding everything.
- Two vendors involved (Pinecone + an embedding provider).

## Alternatives considered
- **pgvector on Supabase**: one less vendor; slower at scale, more ops.
- **Weaviate Cloud**: more features, costlier.
- **Qdrant Cloud**: solid, similar trade-offs.
- **None / skip**: also valid for many products. Hence the opt-in.
