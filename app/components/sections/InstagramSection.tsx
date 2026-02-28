"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Box,
  Container,
  Stack,
  Title,
  Text,
  Button,
  Anchor,
  ActionIcon,
  Group,
  Overlay,
} from "@mantine/core";
import {
  IconBrandInstagram,
  IconHeart,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { instagramPosts, type InstagramPost } from "@/lib/data/instagram";
import { useTranslation } from "../../contexts/TranslationContext";

export default function InstagramSection() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 5;
  const maxIndex = Math.max(0, instagramPosts.length - itemsPerView);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));

  const handleNext = () =>
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));

  const visiblePosts = instagramPosts.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <Box component="section" mt={{ base: "xl", md: "2xl" }} py={{ base: "xl", md: "2xl" }} bg="gray.0">
      <Container size="xl">
        {/* Section Header */}
        <Stack align="center" gap="xs" mb="xl">
          <Title order={2} fz={{ base: "2xl", md: "3xl" }} fw={300} c="dark">
            {t("common.followOurJourney")}
          </Title>
          <Text c="dimmed" ta="center" fz="sm">
            {t("common.followJourneyDesc")}
          </Text>
          <Anchor
            href="https://instagram.com/afmondo"
            target="_blank"
            rel="noopener noreferrer"
            fz="sm"
            fw={600}
            c="dark"
            style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none" }}
          >
            <IconBrandInstagram size={18} />
            @afmondo
          </Anchor>
        </Stack>

        {/* Posts Grid */}
        <Box pos="relative">
          <Box
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 12,
            }}
            visibleFrom="lg"
          >
            {visiblePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </Box>

          {/* Mobile: 2-col grid showing first 4 */}
          <Box
            hiddenFrom="lg"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 8,
            }}
          >
            {instagramPosts.slice(0, 4).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </Box>

          {/* Desktop nav arrows */}
          {instagramPosts.length > itemsPerView && (
            <>
              <ActionIcon
                onClick={handlePrev}
                pos="absolute"
                color="dark"
                variant="filled"
                radius="xl"
                size="lg"
                aria-label="Previous posts"
                visibleFrom="lg"
                style={{ top: "50%", left: -52, transform: "translateY(-50%)" }}
              >
                <IconChevronLeft size={20} />
              </ActionIcon>
              <ActionIcon
                onClick={handleNext}
                pos="absolute"
                color="dark"
                variant="filled"
                radius="xl"
                size="lg"
                aria-label="Next posts"
                visibleFrom="lg"
                style={{ top: "50%", right: -52, transform: "translateY(-50%)" }}
              >
                <IconChevronRight size={20} />
              </ActionIcon>
            </>
          )}
        </Box>

        {/* Follow CTA */}
        <Stack align="center" mt="xl">
          <Button
            component="a"
            href="https://instagram.com/afmondo"
            target="_blank"
            rel="noopener noreferrer"
            color="dark"
            size="md"
            radius="md"
            leftSection={<IconBrandInstagram size={18} />}
          >
            {t("common.followOnInstagram")}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

function PostCard({ post }: { post: InstagramPost }) {
  return (
    <Box
      component="a"
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      pos="relative"
      style={{
        aspectRatio: "1/1",
        borderRadius: "var(--mantine-radius-md)",
        overflow: "hidden",
        display: "block",
        cursor: "pointer",
      }}
    >
      <Image
        src={post.image}
        alt={post.caption}
        fill
        style={{
          objectFit: "cover",
          transition: "transform 300ms ease",
        }}
        className="instagram-img"
      />

      {/* Hover overlay */}
      <Overlay
        color="#000"
        backgroundOpacity={0.6}
        className="instagram-overlay"
        style={{
          opacity: 0,
          transition: "opacity 250ms ease",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: 16,
        }}
      >
        <Group gap="xs" c="white">
          <IconHeart size={18} />
          <Text fz="sm" fw={600} c="white">
            {post.likes}
          </Text>
        </Group>
        <Text fz="xs" c="rgba(255,255,255,0.85)" ta="center" lineClamp={2}>
          {post.caption}
        </Text>
      </Overlay>
    </Box>
  );
}
