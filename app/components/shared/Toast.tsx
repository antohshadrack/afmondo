"use client";

import React, { useEffect } from "react";
import { IconX, IconCircleCheck } from "@tabler/icons-react";
import { Box, Group, Text, ActionIcon, ThemeIcon } from "@mantine/core";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <Box
      pos="fixed"
      top={16}
      right={16}
      style={{ zIndex: 9999 }}
    >
      <Box
        bg="white"
        style={{
          boxShadow: "var(--mantine-shadow-lg)",
          borderRadius: "var(--mantine-radius-md)",
          border: "1px solid var(--mantine-color-green-2)",
          minWidth: 300,
        }}
        p="md"
      >
        <Group gap="sm" align="center" wrap="nowrap">
          <ThemeIcon color="green" variant="light" radius="xl" size="md" style={{ flexShrink: 0 }}>
            <IconCircleCheck size={16} />
          </ThemeIcon>
          <Text c="dark" fz="sm" style={{ flex: 1 }}>
            {message}
          </Text>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            onClick={onClose}
            aria-label="Close notification"
            style={{ flexShrink: 0 }}
          >
            <IconX size={16} />
          </ActionIcon>
        </Group>
      </Box>
    </Box>
  );
}
