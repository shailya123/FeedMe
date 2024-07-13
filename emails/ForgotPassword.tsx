import {
    Column,
    Font,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Row,
    Section,
    Text
} from '@react-email/components';
interface ForgotPasswordProps {
    forgotPasswordLink: string;
}

export default function ForgotPasswordEmail({ forgotPasswordLink }: ForgotPasswordProps) {
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>Forgot Password Link</title>
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
            <Preview>Here's your forgot password link: {forgotPasswordLink}</Preview>
            <Section>
                <Row>
                    <Heading as="h2">Hello</Heading>
                </Row>
                <Row>
                    <Text>
                        This link will remain valid for the next hour.
                    </Text>
                </Row>
                <Row>
                    <Column><Text>Forgot Password Link: {forgotPasswordLink}</Text></Column>

                </Row>
                <Row>
                    <Text>
                        If you did not request this link, please ignore this email.
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