"use client";

import Image from "next/image";
import { teamMembers } from "@/lib/data/team";
import {
  Box,
  Container,
  SimpleGrid,
  Stack,
  Title,
  Text,
} from "@mantine/core";
import { useTranslation } from "../../contexts/TranslationContext";

export default function TeamSection() {
  const { t } = useTranslation();
  return (
    <Box
      component="section"
      mt={{ base: "xl", md: "2xl" }}
      py={{ base: "xl", md: "2xl" }}
    >
      <Container size="xl">
        {/* Section Header */}
        <Stack align="center" gap="xs" mb="xl">
          <Title order={2} fz={{ base: "2xl", md: "3xl" }} fw={300} c="dark">
            {t("team.title")}
          </Title>
          <Text c="dimmed" fz="sm" ta="center" maw={600}>
            {t("team.subtitle")}
          </Text>
        </Stack>

        {/* Team Grid */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
          {teamMembers.map((member) => (
            <Stack key={member.id} align="center" gap="sm">
              {/* Photo */}
              <Box
                pos="relative"
                style={{
                  width: "100%",
                  height: 280,
                  overflow: "hidden",
                  borderRadius: "var(--mantine-radius-lg)",
                }}
                className="team-member-card"
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  style={{ objectFit: "cover", transition: "transform 300ms ease" }}
                  className="team-member-img"
                />
              </Box>

              {/* Info */}
              <Stack align="center" gap={4}>
                <Text fz="lg" fw={600} c="dark">
                  {member.name}
                </Text>
                <Text
                  fz="xs"
                  fw={400}
                  c="dimmed"
                  tt="uppercase"
                  style={{ letterSpacing: 2 }}
                >
                  {member.role}
                </Text>
                {member.bio && (
                  <Text fz="sm" c="dimmed" ta="center" lh={1.6} mt={4}>
                    {member.bio}
                  </Text>
                )}
              </Stack>
            </Stack>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}
