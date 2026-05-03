import { Body, Container, Heading, Html, Text } from '@react-email/components';

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
  <Html>
    <Body style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <Container>
        <Heading>Welcome to __PROJECT_NAME__</Heading>
        <Text>Hi {name}, glad to have you. __SOLUTION__</Text>
        <Text>If you have a question, just reply — this address forwards to a human.</Text>
      </Container>
    </Body>
  </Html>
);
