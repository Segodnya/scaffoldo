import { Body, Container, Heading, Html, Text } from '@react-email/components';

interface PaymentSuccessEmailProps {
  plan: string;
  amountCents: number;
}

const formatAmount = (cents: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

export const PaymentSuccessEmail = ({ plan, amountCents }: PaymentSuccessEmailProps) => (
  <Html>
    <Body style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <Container>
        <Heading>Payment received</Heading>
        <Text>
          Thanks — your <strong>{plan}</strong> plan is active. We charged{' '}
          <strong>{formatAmount(amountCents)}</strong>.
        </Text>
        <Text>You can manage billing any time from Settings → Billing.</Text>
      </Container>
    </Body>
  </Html>
);
