import { notFound } from "next/navigation";
import { CompanyDetailHeader } from "@/components/companies/company-detail-header";
import { CompanyDetailTabs } from "@/components/companies/company-detail-tabs";
import { createClient } from "@/lib/supabase/server";

export default async function CompanyDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ from?: string; tab?: string }> }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const [{ data: company }, { data: events }, { data: schedules }, { data: interviews }, { data: research }] = await Promise.all([
    supabase.from("companies").select("*").eq("id", id).maybeSingle(),
    supabase.from("selection_events").select("*").eq("company_id", id).order("event_date", { ascending: false }),
    supabase.from("schedules").select("*").eq("company_id", id).order("start_at"),
    supabase.from("interview_records").select("*").eq("company_id", id).order("interview_date", { ascending: false }),
    supabase.from("company_research").select("*").eq("company_id", id).maybeSingle(),
  ]);
  if (!company) notFound();
  const backHref = query.from?.startsWith("/companies") ? query.from : "/companies";
  return <><CompanyDetailHeader company={company} backHref={backHref} /><main className="mx-auto max-w-[1200px] p-8"><CompanyDetailTabs company={company} events={events ?? []} schedules={schedules ?? []} interviews={interviews ?? []} research={research} initialTab={query.tab} /></main></>;
}
