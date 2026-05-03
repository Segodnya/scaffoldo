import { promises as fs } from 'node:fs';
import path from 'node:path';
import fse from 'fs-extra';

const PRISMA_SCHEMA = 'packages/db/prisma/schema.prisma';

const toCamel = (pascal: string): string => pascal.charAt(0).toLowerCase() + pascal.slice(1);
const toKebab = (pascal: string): string =>
  pascal
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();

const modelStub = (entity: string): string => `
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

const pageStub = (entity: string): string => {
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

/**
 * For each declared entity:
 *  - append a Prisma model to packages/db/prisma/schema.prisma
 *  - create apps/web/app/(app)/<kebab>/page.tsx as a CRUD shell
 */
export const stubDomainEntities = async (targetDir: string, entities: string[]): Promise<void> => {
  if (entities.length === 0) return;

  const schemaPath = path.join(targetDir, PRISMA_SCHEMA);
  if (await fse.pathExists(schemaPath)) {
    const existing = await fs.readFile(schemaPath, 'utf8');
    const additions = entities
      .filter((e) => !new RegExp(`^model\\s+${e}\\b`, 'm').test(existing))
      .map(modelStub)
      .join('\n');
    if (additions) {
      await fs.writeFile(schemaPath, `${existing.trimEnd()}\n${additions}\n`);
    }
  }

  for (const entity of entities) {
    const dir = path.join(targetDir, 'apps/web/app/(app)', toKebab(entity));
    await fse.ensureDir(dir);
    const filePath = path.join(dir, 'page.tsx');
    if (!(await fse.pathExists(filePath))) {
      await fs.writeFile(filePath, pageStub(entity));
    }
  }
};
