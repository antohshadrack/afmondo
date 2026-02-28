"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Center, Loader } from "@mantine/core";

export default function DealsFlashSalesRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/flash-sales"); }, [router]);
  return (
    <Center style={{ minHeight: "100vh" }}>
      <Loader color="orange" />
    </Center>
  );
}
