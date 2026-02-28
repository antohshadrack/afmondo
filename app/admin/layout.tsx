import { Box } from "@mantine/core";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account/login?redirectTo=/admin");
  }

  // Database queries are much safer and not aggressively cached here in Server Components
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <Box style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--mantine-color-gray-0)" }}>
      <AdminSidebar />
      <Box style={{ flex: 1, overflow: "auto" }}>
        {children}
      </Box>
    </Box>
  );
}
