import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/account/login?redirectTo=/admin");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/");

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f5f6f8" }}>
      <AdminSidebar />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <AdminTopBar email={user.email ?? ""} />
        <main style={{ flex: 1, padding: "0" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
