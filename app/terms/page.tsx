"use client";

import Header from "../components/shared/header";
import Footer from "../components/sections/Footer";
import { Box, Container, Title, Text, Stack, Anchor, Divider } from "@mantine/core";

const lastUpdated = "February 28, 2025";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: [
      "By accessing or using the Afmondo platform (website, mobile application, or any related service), you agree to be bound by these Terms of Service and all applicable laws. If you do not agree, you must not use our services.",
      "These terms apply to all visitors, customers, and registered users of Afmondo.",
    ],
  },
  {
    title: "2. Eligibility",
    content: [
      "You must be at least 18 years old to create an account or make a purchase on Afmondo.",
      "By using our services, you confirm that all information you provide is accurate and up to date.",
    ],
  },
  {
    title: "3. Accounts",
    content: [
      "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.",
      "You must notify us immediately at support@afmondo.com if you suspect unauthorised use of your account.",
      "We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.",
    ],
  },
  {
    title: "4. Products & Pricing",
    content: [
      "We strive to ensure that product descriptions, images, and prices are accurate. However, we do not warrant that all information is error-free.",
      "Prices are listed in CFA Francs (XOF) and are subject to change without notice. The price at the time of your order confirmation is the price you will pay.",
      "We reserve the right to cancel any order where a pricing error has occurred, in which case a full refund will be issued.",
    ],
  },
  {
    title: "5. Orders & Payment",
    content: [
      "Placing an order constitutes an offer to purchase. Order confirmation does not constitute acceptance — acceptance occurs when the order is dispatched.",
      "Payment must be completed before an order is processed. We accept Orange Money, Wave, Free Money, bank transfer, and cash on delivery for eligible orders.",
      "We reserve the right to refuse orders at our sole discretion, including in cases of suspected fraud.",
    ],
  },
  {
    title: "6. Delivery",
    content: [
      "Delivery timelines are estimates and not guarantees. We are not liable for delays caused by circumstances outside our control, including weather, strikes, or logistical disruptions.",
      "Risk of loss and title for products pass to you upon delivery. Please inspect your order upon receipt and report any damage or discrepancy within 24 hours.",
    ],
  },
  {
    title: "7. Returns & Refunds",
    content: [
      "Returns are subject to our Returns Policy, which is incorporated by reference into these Terms. Please review the Returns page for full details.",
      "Refunds are processed to the original payment method and may take 3–5 business days.",
    ],
  },
  {
    title: "8. Intellectual Property",
    content: [
      "All content on the Afmondo platform, including logos, text, images, and software, is the property of Afmondo or its licensors and is protected by copyright law.",
      "You may not reproduce, distribute, or use any content from our platform without prior written permission.",
    ],
  },
  {
    title: "9. Prohibited Use",
    content: [
      "Using the platform to engage in fraudulent, deceptive, or illegal activity.",
      "Scraping, crawling, or data-mining our platform without written permission.",
      "Uploading or transmitting malicious code or interfering with the security of our systems.",
      "Impersonating any person or entity or misrepresenting your affiliation with any person or entity.",
    ],
  },
  {
    title: "10. Limitation of Liability",
    content: [
      "To the fullest extent permitted by law, Afmondo shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.",
      "Our total liability to you for any claim arising from these terms shall not exceed the amount you paid for the relevant order.",
    ],
  },
  {
    title: "11. Governing Law",
    content: [
      "These Terms of Service are governed by the laws of the Republic of Senegal. Any disputes shall be subject to the exclusive jurisdiction of the courts of Dakar, Sénégal.",
    ],
  },
  {
    title: "12. Changes to These Terms",
    content: [
      "We may revise these Terms at any time. We will notify you of significant changes via email or a notice on our platform. Continued use of our services after changes constitutes acceptance.",
    ],
  },
  {
    title: "13. Contact",
    content: [
      "For questions about these Terms of Service, please contact us at legal@afmondo.com or write to Afmondo, Dakar, Sénégal.",
    ],
  },
];

export default function TermsPage() {
  return (
    <Box>
      <Header />

      <Box bg="dark.8" py={{ base: 48, md: 72 }} style={{ borderBottom: "3px solid var(--afmondo-orange)" }}>
        <Container size="md">
          <Text fz="xs" fw={600} tt="uppercase" c="orange.4" style={{ letterSpacing: 2 }} mb={10}>Legal</Text>
          <Title order={1} c="white" fw={800} fz={{ base: "2xl", md: "3xl" }} lh={1.2}>Terms of Service</Title>
          <Text c="rgba(255,255,255,0.5)" mt={8} fz="sm">Last updated: {lastUpdated}</Text>
        </Container>
      </Box>

      <Box py={{ base: "xl", md: 80 }} bg="white">
        <Container size="md">
          <Text c="dimmed" fz="sm" lh={1.9} mb="xl">
            Please read these Terms of Service carefully before using Afmondo. They govern your access to and use
            of our platform and constitute a legally binding agreement between you and Afmondo.
          </Text>

          <Stack gap="xl">
            {sections.map((section) => (
              <Box key={section.title}>
                <Title order={3} fw={700} fz="md" mb="sm" c="dark">{section.title}</Title>
                <Stack gap="sm">
                  {section.content.map((item, i) => (
                    <Box key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <Box style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "var(--afmondo-orange)", flexShrink: 0, marginTop: 9 }} />
                      <Text fz="sm" c="dimmed" lh={1.9}>{item}</Text>
                    </Box>
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>

          <Divider my="xl" />
          <Text fz="xs" c="dimmed">
            Questions? Email us at{" "}
            <Anchor href="mailto:legal@afmondo.com" c="orange.6" fz="xs">legal@afmondo.com</Anchor>
          </Text>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
