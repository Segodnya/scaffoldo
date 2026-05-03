import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

/**
 * Singleton Prisma client. Reusing the instance across hot reloads in dev
 * avoids exhausting Postgres connections on every save.
 */
export const db: PrismaClient =
  globalThis.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = db;
}

export type { Prisma } from '@prisma/client';
export type { User, Subscription } from '@prisma/client';
