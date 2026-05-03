import { redirect } from 'next/navigation';
import { requireDbUser } from '@__PROJECT_SLUG__/auth';

export default async function DashboardPage() {
  const user = await requireDbUser();
  if (!user.onboardedAt) redirect('/onboarding');

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Welcome back, {user.name ?? user.email}.</h1>
      <p className="text-sm text-muted-foreground">
        This is your dashboard. Replace it with the first screen your users see after sign-in.
      </p>
    </main>
  );
}
