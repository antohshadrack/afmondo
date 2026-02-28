"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box, Stack, Text, Title, TextInput,
  PasswordInput, Button, Group, Anchor, Divider, Checkbox, Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconMail, IconLock, IconBrandGoogle,
  IconArrowLeft, IconShieldCheck, IconTruck, IconHeadset,
  IconAlertCircle,
} from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";

const brandPoints = [
  { icon: <IconShieldCheck size={18} />, text: "Secure payments & buyer protection" },
  { icon: <IconTruck size={18} />, text: "Doorstep delivery across Senegal" },
  { icon: <IconHeadset size={18} />, text: "Dedicated customer support" },
];

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "register">("login");
  const supabase = createClient();

  const form = useForm({
    initialValues: { email: "", password: "", name: "", remember: false },
    validate: {
      email: (v: string) => (/^\S+@\S+\.\S+$/.test(v) ? null : "Enter a valid email"),
      password: (v: string) => (v.length < 6 ? "Password must be at least 6 characters" : null),
      name: (v: string) =>
        mode === "register" && v.trim().length < 2 ? "Name must be at least 2 characters" : null,
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setLoading(true);
    setError(null);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        router.push(redirectTo);
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { full_name: values.name },
        },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        setError(null);
        setLoading(false);
        // Show email confirmation message
        form.reset();
        setMode("login");
        setError("Account created! Check your email to confirm your address, then sign in.");
      }
    }
  });

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}` },
    });
  };

  return (
    <Box style={{ minHeight: "100vh", display: "flex" }}>

      {/* ── Left panel — brand ─────────────────────────── */}
      <Box
        visibleFrom="md"
        style={{
          flex: "0 0 45%",
          backgroundColor: "var(--mantine-color-dark-8)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 52px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: "var(--afmondo-orange)" }} />
        <Box style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)", backgroundSize: "32px 32px", pointerEvents: "none" }} />

        <Box style={{ position: "relative", zIndex: 1 }}>
          <Link href="/" style={{ display: "inline-block" }}>
            <Image src="/logo.png" alt="Afmondo" width={130} height={46} style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }} />
          </Link>
        </Box>

        <Box style={{ position: "relative", zIndex: 1 }}>
          <Text fz="xs" fw={600} tt="uppercase" style={{ letterSpacing: 2, color: "var(--afmondo-orange)" }} mb={12}>
            Afmondo Marketplace
          </Text>
          <Title order={2} fw={800} c="white" fz="2xl" lh={1.2} mb="xl">
            {mode === "login" ? "Good to have\nyou back." : "Join thousands\nof happy buyers."}
          </Title>
          <Stack gap="md">
            {brandPoints.map((pt, i) => (
              <Group key={i} gap="sm" align="center">
                <Box style={{ color: "var(--afmondo-orange)", flexShrink: 0 }}>{pt.icon}</Box>
                <Text fz="sm" c="rgba(255,255,255,0.7)">{pt.text}</Text>
              </Group>
            ))}
          </Stack>
        </Box>

        <Box style={{ position: "relative", zIndex: 1 }}>
          <Text fz="xs" c="rgba(255,255,255,0.35)">© {new Date().getFullYear()} Afmondo · Dakar, Sénégal</Text>
        </Box>
      </Box>

      {/* ── Right panel — form ─────────────────────────── */}
      <Box
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "48px 24px",
          backgroundColor: "white",
          overflowY: "auto",
        }}
      >
        <Box hiddenFrom="md" mb="xl">
          <Link href="/"><Image src="/logo.png" alt="Afmondo" width={120} height={42} style={{ objectFit: "contain" }} /></Link>
        </Box>

        <Box w="100%" style={{ maxWidth: 400 }}>
          <Box mb="xl">
            <Title order={2} fw={800} fz="xl" mb={4}>
              {mode === "login" ? "Sign in to your account" : "Create your account"}
            </Title>
            <Text fz="sm" c="dimmed">
              {mode === "login" ? "Enter your details below to continue." : "Fill in your info to get started."}
            </Text>
          </Box>

          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color={error.includes("created") ? "green" : "red"}
              mb="md"
              radius="sm"
              variant="light"
            >
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="default"
            leftSection={<IconBrandGoogle size={17} />}
            radius="sm"
            mb="md"
            size="md"
            onClick={handleGoogleLogin}
            styles={{ root: { fontWeight: 500 } }}
          >
            Continue with Google
          </Button>

          <Divider label="or" labelPosition="center" mb="md" />

          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              {mode === "register" && (
                <TextInput label="Full Name" placeholder="Your name" radius="sm" size="md" required {...form.getInputProps("name")} />
              )}
              <TextInput label="Email" placeholder="you@email.com" leftSection={<IconMail size={16} />} radius="sm" size="md" required {...form.getInputProps("email")} />
              <PasswordInput label="Password" placeholder={mode === "login" ? "Your password" : "At least 6 characters"} leftSection={<IconLock size={16} />} radius="sm" size="md" required {...form.getInputProps("password")} />

              {mode === "login" && (
                <Group justify="space-between" align="center">
                  <Checkbox label="Remember me" size="sm" color="orange" {...form.getInputProps("remember", { type: "checkbox" })} />
                  <Anchor fz="sm" c="orange.6" fw={500}>Forgot password?</Anchor>
                </Group>
              )}

              <Button type="submit" fullWidth color="orange" size="md" radius="sm" loading={loading} mt={4} style={{ fontWeight: 700 }}>
                {mode === "login" ? "Sign In" : "Create Account"}
              </Button>
            </Stack>
          </form>

          <Divider mt="xl" mb="lg" />

          <Text ta="center" fz="sm" c="dimmed">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <Anchor fz="sm" c="orange.6" fw={600} onClick={() => { setMode(mode === "login" ? "register" : "login"); form.reset(); setError(null); }}>
              {mode === "login" ? "Sign up free" : "Sign in"}
            </Anchor>
          </Text>

          <Box mt="md" ta="center">
            <Anchor component={Link} href="/" fz="xs" c="dimmed">
              <Group gap={4} justify="center"><IconArrowLeft size={12} />Continue as guest</Group>
            </Anchor>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
