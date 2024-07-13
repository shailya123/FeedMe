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
interface ResendOtpProps {
  username: string;
  otp: string;
}

export default function ResendOtpEmail({ username, otp }: ResendOtpProps) {
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
      <Preview  style={{fontWeight:'bold'}}>Here's your verification code: {otp}</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>
            please use the verification code provided below. This code will remain valid for the next hour.
          </Text>
        </Row>
        <Row>
          <Column><Text  style={{fontWeight:'bold'}}>Verification OTP: {otp}</Text></Column>
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