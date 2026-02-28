"use client";

import Header from "../components/shared/header";
import Footer from "../components/sections/Footer";
import { Box, Container, Title, Text, Stack, Timeline, ThemeIcon, Divider } from "@mantine/core";
import { IconMapPin, IconBolt, IconStar, IconTruck, IconGlobe } from "@tabler/icons-react";

const milestones = [
  {
    year: "2019",
    icon: <IconMapPin size={16} />,
    title: "Founded in Dakar",
    desc: "Afmondo was founded by a small team passionate about changing how Senegalese consumers access quality goods.",
  },
  {
    year: "2020",
    icon: <IconBolt size={16} />,
    title: "First 100 products",
    desc: "We launched our first categories — vehicles and electronics — partnering with three local distributors.",
  },
  {
    year: "2021",
    icon: <IconTruck size={16} />,
    title: "Nationwide delivery",
    desc: "Expanded delivery to Thiès, Saint-Louis, Ziguinchor, and Kaolack, reaching thousands of new customers.",
  },
  {
    year: "2022",
    icon: <IconStar size={16} />,
    title: "10,000 happy customers",
    desc: "Crossed 10,000 satisfied orders and launched furniture and home appliance categories.",
  },
  {
    year: "2023",
    icon: <IconGlobe size={16} />,
    title: "West Africa expansion",
    desc: "Began serving customers in Côte d'Ivoire and Mali, extending our trusted network across the region.",
  },
];

export default function StoryPage() {
  return (
    <Box>
      <Header />

      {/* Hero */}
      <Box bg="dark.8" py={{ base: 60, md: 80 }} style={{ borderBottom: "3px solid var(--afmondo-orange)" }}>
        <Container size="md" ta="center">
          <Text fz="xs" fw={600} tt="uppercase" c="orange.4" style={{ letterSpacing: 2 }} mb={10}>
            Our Story
          </Text>
          <Title order={1} c="white" fw={800} fz={{ base: "2xl", md: "4xl" }} lh={1.15}>
            Built in Senegal, for Senegal
          </Title>
          <Text c="rgba(255,255,255,0.6)" mt="lg" fz="md" lh={1.8} maw={540} mx="auto">
            From a small office in Dakar to serving customers across West Africa —
            here's how Afmondo came to be.
          </Text>
        </Container>
      </Box>

      {/* Origin story */}
      <Box py={{ base: "xl", md: 80 }} bg="white">
        <Container size="md">
          <Stack gap="lg">
            <Text fz="xs" fw={700} tt="uppercase" c="orange.6" style={{ letterSpacing: 2 }}>
              How it started
            </Text>
            <Title order={2} fw={800} fz={{ base: "xl", md: "2xl" }} lh={1.2}>
              Tired of counterfeit products and opaque pricing
            </Title>
            <Text c="dimmed" lh={1.9} fz="sm">
              Our founders had a frustrating experience trying to buy a refrigerator in Dakar.
              Every market offered different prices, vague warranties, and products of unknown origin.
              They knew there had to be a better way — one built on transparency, verified quality,
              and service that actually cared about the buyer.
            </Text>
            <Text c="dimmed" lh={1.9} fz="sm">
              So in 2019, they launched Afmondo with just a handful of products and one core rule:
              every item must be sourced from a verified supplier with a traceable warranty.
              That rule still holds today.
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* Timeline */}
      <Box py={{ base: "xl", md: 80 }} bg="gray.0" style={{ borderTop: "1px solid var(--mantine-color-gray-2)" }}>
        <Container size="md">
          <Text fz="xs" fw={700} tt="uppercase" c="orange.6" style={{ letterSpacing: 2 }} mb={6}>
            Milestones
          </Text>
          <Title order={2} fw={800} fz={{ base: "xl", md: "2xl" }} mb={40}>Our Journey</Title>

          <Timeline active={milestones.length - 1} bulletSize={36} lineWidth={2} color="orange">
            {milestones.map((m) => (
              <Timeline.Item
                key={m.year}
                bullet={
                  <ThemeIcon size={36} radius="xl" color="orange" variant="filled">
                    {m.icon}
                  </ThemeIcon>
                }
                title={
                  <Text fw={700} fz="sm">{m.title}</Text>
                }
              >
                <Text fz="xs" fw={600} c="orange.6" mb={4}>{m.year}</Text>
                <Text fz="sm" c="dimmed" lh={1.7}>{m.desc}</Text>
              </Timeline.Item>
            ))}
          </Timeline>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
