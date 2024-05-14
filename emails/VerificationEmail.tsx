import {
  Button,
  Column,
  Font,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text
} from '@react-email/components';
import { Clipboard } from 'lucide-react';
import logo from '../public/logo.png'
interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here's your verification code: {otp}</Preview>
      <Clipboard onClick={() => navigator.clipboard.writeText(otp)} />
      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>
            Thank you for registering. To complete your registration, please use the verification code provided below. This code will remain valid for the next hour.
          </Text>
        </Row>
        <Row>
          <Column><Text>Verification OTP: {otp}</Text></Column>
          <Column>     <Text><Clipboard onClick={() => navigator.clipboard.writeText(otp)} /></Text></Column>
        </Row>
        <Row>
          <Tailwind
            config={{
              theme: {
                extend: {
                  colors: {
                    brand: "#007291",
                  },
                },
              },
            }}
          >
            <Button
              href={`http://localhost:3000/verify/${username}`}
              className="bg-brand px-3 py-2 font-medium leading-4 text-white"
            >
              Verify here
            </Button>
          </Tailwind>
        </Row>
        <Row>
          <Text>
            If you did not request this code, please ignore this email.
          </Text>
        </Row>
      </Section>
      <Section>
        <Row>
          <Text>Regards,</Text>
          <Text style={{ marginBottom: '0.5rem' }}>Team FeedMe</Text>
        </Row>
        <Row>
          <Img src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI05d0VUtdygXuHVKOxN-gnKCAsOu-1ZKN7Q&s'} width={100} height={100} />
        </Row>
      </Section>
    </Html>
  );
}