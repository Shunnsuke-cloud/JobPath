import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <main className="grid min-h-screen min-w-[1024px] grid-cols-[1.05fr_0.95fr] bg-slate-50"><section className="flex flex-col justify-between bg-[#1e3a8a] p-12 text-white"><Link href="/login" className="flex items-center gap-2 text-xl font-semibold"><BriefcaseBusiness className="size-6" />JobPath</Link><div><p className="mb-4 text-sm font-medium text-blue-200">就職活動の業務管理を、ひとつに。</p><h1 className="max-w-lg text-4xl font-semibold leading-tight">企業、選考、予定を<br />迷わず整理する。</h1><p className="mt-6 max-w-md leading-7 text-blue-100">JobPathは、就職活動中の情報を一元管理し、今日やるべきことを見失わないためのPC向けアプリケーションです。</p></div><p className="text-sm text-blue-200">推奨画面幅：1280px以上</p></section><section className="flex items-center justify-center p-12">{children}</section></main>;
}
