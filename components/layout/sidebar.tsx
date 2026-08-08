"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, BriefcaseBusiness, CalendarDays, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const items = [{ href: "/dashboard", label: "ダッシュボード", icon: LayoutDashboard }, { href: "/companies", label: "企業一覧", icon: Building2 }, { href: "/schedule", label: "予定", icon: CalendarDays }, { href: "/settings", label: "アカウント設定", icon: Settings }];
export function Sidebar() {
  const pathname = usePathname(); const router = useRouter();
  async function signOut() { await createClient().auth.signOut(); router.replace("/login"); router.refresh(); }
  return <aside className="flex h-screen w-60 shrink-0 flex-col border-r bg-white px-3 py-5"><Link href="/dashboard" className="mb-8 flex items-center gap-2 px-3 text-lg font-semibold"><BriefcaseBusiness className="size-5 text-blue-600" />JobPath</Link><nav className="space-y-1">{items.map(({ href, label, icon: Icon }) => { const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`)); return <Link key={href} href={href} className={cn("flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100", active && "bg-blue-50 text-blue-700") }><Icon className="size-4" />{label}</Link>; })}</nav><button type="button" onClick={signOut} className="mt-auto flex h-10 items-center gap-3 rounded-md px-3 text-left text-sm font-medium text-slate-600 hover:bg-slate-100"><LogOut className="size-4" />ログアウト</button></aside>;
}
