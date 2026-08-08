import { redirect } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/login");
  return <AppLayout>{children}</AppLayout>;
}
