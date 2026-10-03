import Link from "next/link";
import { AlertTriangle, Building2, CalendarClock, CalendarDays, CircleCheck, Clock3, Trophy } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { CompanyStatusBadge } from "@/components/companies/company-status-badge";
import { createClient } from "@/lib/supabase/server";
import { getDashboardCounts, currentTime, getScheduleState } from "@/lib/utils/dashboard";

type ScheduleItem = {
  id: string;
  title: string;
  schedule_type: string;
  start_at: string;
  is_completed: boolean;
  is_deadline: boolean;
  company: { id: string; name: string } | null;
};

const formatter = new Intl.DateTimeFormat("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tokyo" });

function ScheduleCard({ title, description, items, tone, icon: Icon, empty, now }: { title: string; description: string; items: ScheduleItem[]; tone: "blue" | "orange" | "red"; icon: typeof CalendarDays; empty: string; now: number }) {
  const toneClasses = { blue: "bg-blue-50 text-blue-700", orange: "bg-orange-50 text-orange-700", red: "bg-red-50 text-red-700" };
  return <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
    <header className="flex items-start gap-3 border-b p-5">
      <span className={`rounded-lg p-2 ${toneClasses[tone]}`}><Icon className="size-5" /></span>
      <div><h2 className="font-semibold text-slate-900">{title}</h2><p className="mt-1 text-xs text-slate-500">{description}</p></div>
      <span className={`ml-auto rounded-full px-2.5 py-1 text-xs font-semibold ${toneClasses[tone]}`}>{items.length}件</span>
    </header>
    {items.length ? <ul className="divide-y">{items.slice(0, 4).map((schedule) => <li key={schedule.id} className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {schedule.company ? <Link className="text-sm font-semibold text-slate-900 hover:text-blue-700 hover:underline" href={`/companies/${schedule.company.id}?tab=${encodeURIComponent(schedule.schedule_type === "面接" ? "面接記録" : "予定・締切")}`}>{schedule.company.name}</Link> : <p className="text-sm font-semibold text-slate-900">企業未設定</p>}
          <p className="mt-1 truncate text-sm text-slate-700">{schedule.title}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${toneClasses[tone]}`}>{getScheduleState(schedule, now)}</span>
      </div>
      <p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><Clock3 className="size-3.5" />{formatter.format(new Date(schedule.start_at))} · {schedule.schedule_type}</p>
    </li>)}</ul> : <p className="px-5 py-10 text-center text-sm text-slate-500">{empty}</p>}
  </section>;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub ?? "";
  const now = currentTime();
  const nowIso = new Date(now).toISOString();
  const sevenDaysIso = new Date(now + 7 * 86400000).toISOString();

  const [{ data: profile }, { data: companies }, { data: upcomingData }, { data: overdueData }] = await Promise.all([
    supabase.from("profiles").select("display_name").eq("id", userId).maybeSingle(),
    supabase.from("companies").select("id,name,current_status,interest_level"),
    supabase.from("schedules").select("id,title,schedule_type,start_at,is_completed,is_deadline,company:companies(id,name)").eq("is_completed", false).gte("start_at", nowIso).lte("start_at", sevenDaysIso).order("start_at"),
    supabase.from("schedules").select("id,title,schedule_type,start_at,is_completed,is_deadline,company:companies(id,name)").eq("is_completed", false).eq("is_deadline", true).lt("start_at", nowIso).order("start_at", { ascending: false }),
  ]);

  const companyItems = companies ?? [];
  const upcoming = (upcomingData ?? []) as unknown as ScheduleItem[];
  const overdue = (overdueData ?? []) as unknown as ScheduleItem[];
  const counts = getDashboardCounts(companyItems.map((company) => company.current_status), upcoming, now);
  const todayKey = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo" }).format(new Date(now));
  const today = upcoming.filter((schedule) => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo" }).format(new Date(schedule.start_at)) === todayKey);
  const nearDeadlines = upcoming.filter((schedule) => schedule.is_deadline && new Date(schedule.start_at).getTime() - now <= 3 * 86400000);
  const favorites = companyItems.filter((company) => (company.interest_level ?? 0) >= 4).sort((a, b) => (b.interest_level ?? 0) - (a.interest_level ?? 0)).slice(0, 5);
  const statusCounts = companyItems.reduce<Record<string, number>>((all, company) => { all[company.current_status] = (all[company.current_status] ?? 0) + 1; return all; }, {});
  const maxStatus = Math.max(...Object.values(statusCounts), 1);

  return <>
    <PageHeader title="ダッシュボード" description="今日やることと、優先度の高い予定を確認できます。" />
    <main className="mx-auto max-w-[1440px] space-y-7 p-8">
      <section><p className="text-sm text-slate-500">おはようございます、{profile?.display_name ?? "ユーザー"}さん</p><h1 className="mt-1 text-2xl font-semibold tracking-tight">まず、今日と締切を確認しましょう。</h1></section>

      <div className="grid grid-cols-3 gap-5">
        <ScheduleCard title="今日の予定" description="本日中に対応する予定" items={today} tone="blue" icon={CalendarDays} empty="今日の予定はありません。" now={now} />
        <ScheduleCard title="近い締切" description="3日以内の未完了の締切" items={nearDeadlines} tone="orange" icon={CalendarClock} empty="3日以内の締切はありません。" now={now} />
        <ScheduleCard title="期限超過" description="期限を過ぎた未完了項目" items={overdue} tone="red" icon={AlertTriangle} empty="期限超過の項目はありません。" now={now} />
      </div>

      <section className="grid grid-cols-4 gap-4">
        <SummaryCard label="登録企業数" value={`${counts.totalCompanies} / 100社`} description="登録できる企業は最大100社" icon={Building2} />
        <SummaryCard label="選考中企業数" value={`${counts.activeCompanies}社`} description="応募済みから最終面接まで" icon={CircleCheck} />
        <SummaryCard label="今後7日間の予定" value={`${counts.upcomingSchedules}件`} description="完了済みを除く予定" icon={CalendarDays} />
        <SummaryCard label="内定数" value={`${counts.offers}社`} description="獲得した内定" icon={Trophy} />
      </section>

      <section className="grid grid-cols-[1.35fr_1fr] gap-6">
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm"><div className="flex items-start justify-between border-b px-5 py-4"><div><h2 className="font-semibold">今後7日間の予定</h2><p className="mt-1 text-sm text-slate-500">日時の近い未完了予定から表示します。</p></div><Link className="text-sm font-medium text-blue-600 hover:underline" href="/schedule">すべて見る</Link></div>{upcoming.length ? <ul className="divide-y">{upcoming.slice(0, 5).map((schedule) => <li key={schedule.id} className="flex items-center justify-between gap-4 px-5 py-4"><div><p className="font-medium">{schedule.company?.name ?? "企業未設定"}　{schedule.title}</p><p className="mt-1 text-sm text-slate-500">{formatter.format(new Date(schedule.start_at))}　·　{schedule.schedule_type}</p></div>{schedule.company && <Link className="shrink-0 text-sm font-medium text-blue-600 hover:underline" href={`/companies/${schedule.company.id}?tab=${encodeURIComponent(schedule.schedule_type === "面接" ? "面接記録" : "予定・締切")}`}>準備を開く</Link>}</li>)}</ul> : <p className="px-5 py-10 text-center text-sm text-slate-500">今後7日間の予定はありません。</p>}</div>
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm"><div className="border-b px-5 py-4"><h2 className="font-semibold">選考状況</h2><p className="mt-1 text-sm text-slate-500">ステータス別の企業数</p></div><div className="space-y-3 p-5">{Object.entries(statusCounts).length ? Object.entries(statusCounts).map(([status, count]) => <div key={status}><div className="mb-1.5 flex items-center justify-between"><CompanyStatusBadge status={status as Parameters<typeof CompanyStatusBadge>[0]["status"]} /><span className="text-sm font-medium text-slate-600">{count}社</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-blue-600" style={{ width: `${(count / maxStatus) * 100}%` }} /></div></div>) : <p className="py-5 text-center text-sm text-slate-500">企業を登録すると集計を表示します。</p>}</div></div>
      </section>

      <section className="overflow-hidden rounded-xl border bg-white shadow-sm"><div className="flex items-start justify-between border-b px-5 py-4"><div><h2 className="font-semibold">志望度が高い企業</h2><p className="mt-1 text-sm text-slate-500">志望度4以上の企業</p></div><Link className="text-sm font-medium text-blue-600 hover:underline" href="/companies">企業一覧へ</Link></div>{favorites.length ? <ul className="divide-y">{favorites.map((company) => <li key={company.id} className="flex items-center justify-between px-5 py-4"><Link href={`/companies/${company.id}`} className="font-semibold hover:text-blue-600 hover:underline">{company.name}</Link><div className="flex items-center gap-4"><CompanyStatusBadge status={company.current_status} /><span className="text-sm text-slate-600">志望度 {company.interest_level} / 5</span></div></li>)}</ul> : <p className="px-5 py-10 text-center text-sm text-slate-500">志望度4以上の企業がありません。</p>}</section>
    </main>
  </>;
}
