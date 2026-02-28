"use client";

import Header from "../components/shared/header";
import Footer from "../components/sections/Footer";
import { Box, Container, Title, Text, Stack, Anchor, Divider } from "@mantine/core";

const lastUpdated = "February 28, 2025";

const sections = [
  {
    title: "1. Information We Collect",
    content: [
      "**Personal information you provide:** When you create an account, place an order, or contact us, we collect information such as your name, email address, phone number, and delivery address.",
      "**Transaction data:** We record details of purchases you make through Afmondo, including products bought, prices paid, and payment method used (we do not store full card or mobile money credentials).",
      "**Device & usage data:** We automatically collect information about your device, browser type, IP address, pages visited, and time spent on our platform to help us improve the service.",
      "**Cookies:** We use cookies and similar technologies to keep you logged in, remember your preferences, and analyse site traffic. You can control cookie settings through your browser.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      "To process and fulfil your orders, including sending confirmation and tracking updates via SMS and email.",
      "To communicate with you about your account, orders, returns, and customer support requests.",
      "To personalise your experience and show you relevant products and promotions.",
      "To improve our platform, diagnose technical issues, and conduct analytics.",
      "To comply with legal obligations and prevent fraud or misuse of our services.",
    ],
  },
  {
    title: "3. Sharing Your Information",
    content: [
      "**Delivery partners:** We share your name, phone number, and delivery address with our logistics partners solely to fulfil your order.",
      "**Payment processors:** Transaction data is shared with our payment partners (Orange Money, Wave, bank processors) to complete payments. These partners have their own privacy policies.",
      "**Legal obligations:** We may disclose your information if required by law, court order, or to protect our rights and the safety of our users.",
      "We do not sell, rent, or trade your personal information to third parties for marketing purposes.",
    ],
  },
  {
    title: "4. Data Security",
    content: [
      "We use industry-standard encryption (TLS/HTTPS) to protect data transmitted between your device and our servers.",
      "Access to personal data within our organisation is restricted to personnel who need it to perform their duties.",
      "While we take reasonable precautions, no method of transmission over the internet is 100% secure. We encourage you to use a strong, unique password for your account.",
    ],
  },
  {
    title: "5. Data Retention",
    content: [
      "We retain your personal information for as long as your account is active or as needed to provide services.",
      "Order and transaction records may be kept for up to 5 years for legal and accounting purposes.",
      "You may request deletion of your account and associated data at any time by contacting us, subject to our legal retention obligations.",
    ],
  },
  {
    title: "6. Your Rights",
    content: [
      "**Access:** You may request a copy of the personal data we hold about you.",
      "**Correction:** You may ask us to correct inaccurate or incomplete information.",
      "**Deletion:** You may request deletion of your personal data, subject to certain exceptions.",
      "**Opt-out:** You may unsubscribe from marketing communications at any time by clicking 'unsubscribe' in any email or contacting us directly.",
      "To exercise any of these rights, contact us at privacy@afmondo.com.",
    ],
  },
  {
    title: "7. Children's Privacy",
    content: [
      "Afmondo is not directed at children under 16. We do not knowingly collect personal information from children. If you believe a child has provided us with their data, please contact us immediately.",
    ],
  },
  {
    title: "8. Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time. When we make significant changes, we will notify you by email or through a prominent notice on our website. Your continued use of Afmondo after any changes constitutes acceptance of the updated policy.",
    ],
  },
  {
    title: "9. Contact",
    content: [
      "For any questions or concerns about this Privacy Policy, please contact our Data Protection Officer at privacy@afmondo.com or write to us at Afmondo, Dakar, Sénégal.",
    ],
  },
];

function renderContent(text: string) {
  // Bold **text** pattern
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <Text span fw={700} c="dark" key={i}>{part.slice(2, -2)}</Text>
      : <Text span key={i}>{part}</Text>
  );
}

export default function PrivacyPage() {
  return (
    <Box>
      <Header />

      <Box bg="dark.8" py={{ base: 48, md: 72 }} style={{ borderBottom: "3px solid var(--afmondo-orange)" }}>
        <Container size="md">
          <Text fz="xs" fw={600} tt="uppercase" c="orange.4" style={{ letterSpacing: 2 }} mb={10}>Legal</Text>
          <Title order={1} c="white" fw={800} fz={{ base: "2xl", md: "3xl" }} lh={1.2}>Privacy Policy</Title>
          <Text c="rgba(255,255,255,0.5)" mt={8} fz="sm">Last updated: {lastUpdated}</Text>
        </Container>
      </Box>

      <Box py={{ base: "xl", md: 80 }} bg="white">
        <Container size="md">
          <Text c="dimmed" fz="sm" lh={1.9} mb="xl">
            At Afmondo, your privacy is important to us. This Privacy Policy explains what information we collect,
            how we use it, and your rights regarding your personal data. By using Afmondo, you agree to the practices
            described in this policy.
          </Text>

          <Stack gap="xl">
            {sections.map((section) => (
              <Box key={section.title}>
                <Title order={3} fw={700} fz="md" mb="sm" c="dark">{section.title}</Title>
                <Stack gap="sm">
                  {section.content.map((item, i) => (
                    <Box key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <Box style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "var(--afmondo-orange)", flexShrink: 0, marginTop: 9 }} />
                      <Text fz="sm" c="dimmed" lh={1.9}>{renderContent(item)}</Text>
                    </Box>
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>

          <Divider my="xl" />
          <Text fz="xs" c="dimmed">
            Questions? Email us at{" "}
            <Anchor href="mailto:privacy@afmondo.com" c="orange.6" fz="xs">privacy@afmondo.com</Anchor>
          </Text>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
