import { redirect } from 'next/navigation';
import { clerkClient } from '@clerk/nextjs/server';
import { requireDbUser } from '@__PROJECT_SLUG__/auth';
import { db } from '@__PROJECT_SLUG__/db';
import { createPortalSession } from '@__PROJECT_SLUG__/payments';

async function openBillingPortal() {
  'use server';
  const user = await requireDbUser();
  const sub = await db.subscription.findUnique({ where: { userId: user.id } });
  if (!sub?.stripeCustomerId) redirect('/dashboard');
  const url = await createPortalSession(
    sub.stripeCustomerId,
    `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/settings`,
  );
  redirect(url);
}

async function deleteAccount() {
  'use server';
  const user = await requireDbUser();
  const client = await clerkClient();
  await client.users.deleteUser(user.id);
  await db.user.delete({ where: { id: user.id } });
  redirect('/');
}

export default async function SettingsPage() {
  const user = await requireDbUser();

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <section className="space-y-2">
        <h2 className="font-medium">Profile</h2>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-medium">Billing</h2>
        <form action={openBillingPortal}>
          <button className="rounded-md border px-4 py-2 text-sm font-medium">
            Open billing portal
          </button>
        </form>
      </section>

      <section className="space-y-2 border-t pt-6">
        <h2 className="font-medium text-destructive">Danger zone</h2>
        <p className="text-sm text-muted-foreground">
          Deleting your account is permanent and removes all your data.
        </p>
        <form action={deleteAccount}>
          <button className="rounded-md border border-destructive px-4 py-2 text-sm font-medium text-destructive">
            Delete account
          </button>
        </form>
      </section>
    </main>
  );
}
