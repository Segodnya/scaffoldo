import { redirect } from 'next/navigation';
import { requireDbUser } from '@__PROJECT_SLUG__/auth';
import { db } from '@__PROJECT_SLUG__/db';

async function completeOnboarding() {
  'use server';
  const user = await requireDbUser();
  await db.user.update({
    where: { id: user.id },
    data: { onboardedAt: new Date() },
  });
  redirect('/dashboard');
}

export default async function OnboardingPage() {
  const user = await requireDbUser();
  if (user.onboardedAt) redirect('/dashboard');

  return (
    <main className="mx-auto max-w-md p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Welcome to __PROJECT_NAME__</h1>
      <p className="text-sm text-muted-foreground">
        A couple of quick questions and you&apos;re in. Replace this with the first-run flow that
        captures whatever data your product needs to be useful immediately.
      </p>
      <form action={completeOnboarding}>
        <button
          type="submit"
          className="w-full rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          Finish
        </button>
      </form>
    </main>
  );
}
