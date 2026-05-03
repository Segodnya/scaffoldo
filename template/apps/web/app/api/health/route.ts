import { NextResponse } from 'next/server';

export const runtime = 'edge';

export const GET = (): NextResponse =>
  NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
