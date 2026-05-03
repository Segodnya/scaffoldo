import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { db } from '@__PROJECT_SLUG__/db';
import { sendWelcomeEmail } from '@__PROJECT_SLUG__/email';
import { log } from '@__PROJECT_SLUG__/observability';
import { requireEnv } from '@__PROJECT_SLUG__/core';

interface ClerkUserPayload {
  id: string;
  email_addresses: Array<{ id: string; email_address: string }>;
  primary_email_address_id?: string;
  first_name?: string;
  last_name?: string;
  image_url?: string;
}

interface ClerkEvent {
  type: 'user.created' | 'user.updated' | 'user.deleted';
  data: ClerkUserPayload;
}

const primaryEmail = (user: ClerkUserPayload): string => {
  const primary = user.email_addresses.find((e) => e.id === user.primary_email_address_id);
  return primary?.email_address ?? user.email_addresses[0]?.email_address ?? '';
};

const fullName = (user: ClerkUserPayload): string =>
  [user.first_name, user.last_name].filter(Boolean).join(' ').trim();

export const POST = async (req: Request): Promise<Response> => {
  const secret = requireEnv('CLERK_WEBHOOK_SECRET');
  const svixId = req.headers.get('svix-id');
  const svixTimestamp = req.headers.get('svix-timestamp');
  const svixSignature = req.headers.get('svix-signature');
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'missing svix headers' }, { status: 400 });
  }

  const body = await req.text();
  let event: ClerkEvent;
  try {
    event = new Webhook(secret).verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as ClerkEvent;
  } catch (err) {
    log.error(err, 'clerk webhook signature mismatch');
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
  }

  switch (event.type) {
    case 'user.created': {
      const email = primaryEmail(event.data);
      const name = fullName(event.data) || null;
      await db.user.create({
        data: { id: event.data.id, email, name, imageUrl: event.data.image_url ?? null },
      });
      await sendWelcomeEmail(email, name ?? 'there');
      break;
    }
    case 'user.updated': {
      await db.user.update({
        where: { id: event.data.id },
        data: {
          email: primaryEmail(event.data),
          name: fullName(event.data) || null,
          imageUrl: event.data.image_url ?? null,
        },
      });
      break;
    }
    case 'user.deleted': {
      await db.user.delete({ where: { id: event.data.id } }).catch(() => undefined);
      break;
    }
    default:
      log.info({ type: (event as ClerkEvent).type }, 'unhandled clerk event');
  }

  return NextResponse.json({ ok: true });
};
