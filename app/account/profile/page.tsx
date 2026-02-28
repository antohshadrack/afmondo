"use client";

import { useState, useEffect } from "react";
import { Box, Paper, Title, Text, TextInput, Button, Group, Alert } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      full_name: "",
      phone: "",
      email: "",
    },
    validate: {
      full_name: (v) => (v.trim().length < 2 ? "Name must be at least 2 characters" : null),
    },
  });

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      setUserId(user.id);
      form.setFieldValue("email", user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user.id)
        .single();

      if (profile) {
        form.setValues({
          full_name: profile.full_name || "",
          phone: profile.phone || "",
        });
      }
      setInitialLoading(false);
    }
    loadProfile();
  }, []);

  const handleSubmit = form.onSubmit(async (values) => {
    if (!userId) return;
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: values.full_name,
        phone: values.phone,
      })
      .eq("id", userId);

    if (error) {
      notifications.show({ title: "Error", message: error.message, color: "red" });
    } else {
      notifications.show({ title: "Profile updated", message: "Your details have been saved.", color: "green", icon: <IconCheck size={16} /> });
    }
    setLoading(false);
  });

  if (initialLoading) {
    return (
      <Paper withBorder radius="md" p="xl" bg="white">
        <Text c="dimmed">Loading profile...</Text>
      </Paper>
    );
  }

  return (
    <Paper withBorder radius="md" p="xl" bg="white">
      <Title order={3} mb="xs">My Profile</Title>
      <Text c="dimmed" fz="sm" mb="xl">Update your personal information</Text>

      <form onSubmit={handleSubmit}>
        <Box maw={400}>
          <TextInput
            label="Email Address"
            description="Linked to your account. Cannot be changed here."
            mb="md"
            disabled
            {...form.getInputProps("email")}
          />
          <TextInput
            label="Full Name"
            placeholder="John Doe"
            mb="md"
            required
            {...form.getInputProps("full_name")}
          />
          <TextInput
            label="Phone Number"
            placeholder="+221 77 123 45 67"
            mb="xl"
            {...form.getInputProps("phone")}
          />
          
          <Button type="submit" color="orange" loading={loading} radius="md">
            Save Changes
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
