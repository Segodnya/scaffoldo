import { promises as fs } from 'node:fs';
import path from 'node:path';
import fse from 'fs-extra';

import type { Stage, StageContext, StageResult } from './scaffold.types.js';

const PRISMA_SCHEMA = 'packages/db/prisma/schema.prisma';

const toCamel = (pascal: string): string => pascal.charAt(0).toLowerCase() + pascal.slice(1);

const toKebab = (pascal: string): string =>
  pascal
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();

export const renderModel = (entity: string): string => `
model ${entity} {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}
`;

export const renderEntityPage = (entity: string): string => {
  const camel = toCamel(entity);
  return `import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@${'__PROJECT_SLUG__'}/db';

export default async function ${entity}IndexPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const ${camel}s = await db.${camel}.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">${entity}s</h1>
      <ul className="divide-y">
        {${camel}s.map((item) => (
          <li key={item.id} className="py-3">
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(item.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
        {${camel}s.length === 0 ? (
          <li className="py-3 text-sm text-muted-foreground">No ${entity.toLowerCase()}s yet.</li>
        ) : null}
      </ul>
    </main>
  );
}
`;
};

const mergeSchema = async (schemaPath: string, entities: string[]): Promise<number> => {
  if (!(await fse.pathExists(schemaPath))) return 0;
  const existing = await fs.readFile(schemaPath, 'utf8');
  const additions = entities
    .filter((e) => !new RegExp(`^model\\s+${e}\\b`, 'm').test(existing))
    .map(renderModel)
    .join('\n');
  if (!additions) return 0;
  await fs.writeFile(schemaPath, `${existing.trimEnd()}\n${additions}\n`);
  return 1;
};

const writeEntityPage = async (targetDir: string, entity: string): Promise<number> => {
  const dir = path.join(targetDir, 'apps/web/app/(app)', toKebab(entity));
  await fse.ensureDir(dir);
  const filePath = path.join(dir, 'page.tsx');
  if (await fse.pathExists(filePath)) return 0;
  await fs.writeFile(filePath, renderEntityPage(entity));
  return 1;
};

/**
 * For each declared entity:
 *  - append a Prisma model to packages/db/prisma/schema.prisma
 *  - create apps/web/app/(app)/<kebab>/page.tsx as a CRUD shell
 *
 * Schema mutation is serial (single shared file); page writes fan out.
 */
export const domainEntitiesStage: Stage = {
  name: 'domain-entities',
  apply: async (ctx: StageContext): Promise<StageResult> => {
    const entities = ctx.answers.domainEntities;
    if (entities.length === 0) return { filesWritten: 0 };

    const schemaWritten = await mergeSchema(
      path.join(ctx.targetDir, PRISMA_SCHEMA),
      entities,
    );
    const pageCounts = await Promise.all(
      entities.map((entity) => writeEntityPage(ctx.targetDir, entity)),
    );
    const pagesWritten = pageCounts.reduce((sum, n) => sum + n, 0);

    return { filesWritten: schemaWritten + pagesWritten };
  },
};
