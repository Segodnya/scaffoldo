import { Resend } from 'resend';
import { WelcomeEmail } from './templates/welcome.js';
import { PaymentSuccessEmail } from './templates/payment-success.js';

let cached: Resend | undefined;

const client = (): Resend | null => {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!cached) cached = new Resend(key);
  return cached;
};

const from = (): string => process.env.EMAIL_FROM ?? 'noreply@example.com';

interface SendOptions {
  to: string;
  subject: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  react: any;
}

const sendOrSkip = async ({ to, subject, react }: SendOptions): Promise<void> => {
  const c = client();
  if (!c) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[email] RESEND_API_KEY missing — skipping "${subject}" to ${to}`);
    }
    return;
  }
  const result = await c.emails.send({ from: from(), to, subject, react });
  if (result.error) throw result.error;
};

export const sendWelcomeEmail = (to: string, name: string): Promise<void> =>
  sendOrSkip({ to, subject: 'Welcome to __PROJECT_NAME__', react: WelcomeEmail({ name }) });

export const sendPaymentSuccessEmail = (
  to: string,
  data: { plan: string; amountCents: number },
): Promise<void> =>
  sendOrSkip({
    to,
    subject: 'Payment received',
    react: PaymentSuccessEmail(data),
  });
