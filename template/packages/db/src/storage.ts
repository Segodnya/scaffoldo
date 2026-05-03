import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { requireEnv } from '@__PROJECT_SLUG__/core';

let cached: SupabaseClient | undefined;

const client = (): SupabaseClient => {
  if (!cached) {
    cached = createClient(
      requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
      requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
      { auth: { persistSession: false } },
    );
  }
  return cached;
};

export const DEFAULT_BUCKET = 'uploads';

export const uploadObject = async (
  path: string,
  body: Blob | ArrayBuffer | Uint8Array,
  options: { bucket?: string; contentType?: string } = {},
): Promise<{ path: string }> => {
  const bucket = options.bucket ?? DEFAULT_BUCKET;
  const { error } = await client()
    .storage.from(bucket)
    .upload(path, body, { contentType: options.contentType, upsert: false });
  if (error) throw error;
  return { path };
};

export const signedUrl = async (
  path: string,
  options: { bucket?: string; expiresIn?: number } = {},
): Promise<string> => {
  const bucket = options.bucket ?? DEFAULT_BUCKET;
  const { data, error } = await client()
    .storage.from(bucket)
    .createSignedUrl(path, options.expiresIn ?? 60 * 60);
  if (error) throw error;
  return data.signedUrl;
};
