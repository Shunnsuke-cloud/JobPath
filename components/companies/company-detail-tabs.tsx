"use client";

import { useState } from "react";
import { CompanyBasicInfo } from "@/components/companies/company-basic-info";
import { CompanyResearchForm } from "@/components/companies/company-research-form";
import { InterviewRecordList } from "@/components/interviews/interview-record-list";
import { SelectionTimeline } from "@/components/selection/selection-timeline";
import { ScheduleDialog } from "@/components/schedules/schedule-dialog";
import { ScheduleList } from "@/components/schedules/schedule-list";
import type { Database } from "@/types/database";

type Company = Database["public"]["Tables"]["companies"]["Row"];
type Event = Database["public"]["Tables"]["selection_events"]["Row"];
type Schedule = Database["public"]["Tables"]["schedules"]["Row"];
type Interview = Database["public"]["Tables"]["interview_records"]["Row"];
type Research = Database["public"]["Tables"]["company_research"]["Row"];
const tabs = ["基本情報", "選考履歴", "予定・締切", "面接記録", "企業研究"] as const;

export function CompanyDetailTabs({ company, events, schedules, interviews, research, initialTab }: { company: Company; events: Event[]; schedules: Schedule[]; interviews: Interview[]; research: Research | null; initialTab?: string }) {
  const [active, setActive] = useState<(typeof tabs)[number]>(tabs.includes(initialTab as (typeof tabs)[number]) ? initialTab as (typeof tabs)[number] : "基本情報");
  return <>
    <div className="mb-6 flex gap-6 border-b">{tabs.map((tab) => <button key={tab} onClick={() => setActive(tab)} className={`px-1 pb-3 text-sm font-medium ${active === tab ? "border-b-2 border-blue-600 text-blue-700" : "text-slate-500 hover:text-slate-800"}`}>{tab}</button>)}</div>
    {active === "基本情報" && <CompanyBasicInfo company={company} />}
    {active === "選考履歴" && <SelectionTimeline companyId={company.id} events={events} />}
    {active === "予定・締切" && <section className="overflow-hidden rounded-xl border bg-white shadow-sm"><header className="flex items-center justify-between border-b px-6 py-4"><div><h2 className="font-semibold">予定・締切</h2><p className="mt-1 text-sm text-slate-500">面接、ES提出期限、説明会などを管理します。</p></div><ScheduleDialog companyId={company.id} /></header>{schedules.length ? <ScheduleList schedules={schedules} /> : <p className="px-6 py-14 text-center text-sm text-slate-500">予定はまだありません。面接や締切を追加してください。</p>}</section>}
    {active === "面接記録" && <InterviewRecordList companyId={company.id} records={interviews} />}
    {active === "企業研究" && <CompanyResearchForm companyId={company.id} research={research ? { companyFeatures: research.company_features ?? "", mainBusiness: research.main_business ?? "", strengths: research.strengths ?? "", weaknesses: research.weaknesses ?? "", motivation: research.motivation ?? "", whatToDoAfterJoining: research.what_to_do_after_joining ?? "", reverseQuestionCandidates: research.reverse_question_candidates ?? "", concerns: research.concerns ?? "" } : undefined} />}
  </>;
}
