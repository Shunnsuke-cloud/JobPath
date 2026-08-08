"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Check, Clock3, Trash2 } from "lucide-react";
import { deleteSchedule, toggleScheduleCompleted } from "@/app/(app)/companies/actions";
import { ScheduleDialog } from "@/components/schedules/schedule-dialog";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/database";

type Schedule = Database["public"]["Tables"]["schedules"]["Row"] & { company?: { id: string; name: string } | null };

function urgency(schedule: Schedule) {
  const difference = new Date(schedule.start_at).getTime() - Date.now();
  if (!schedule.is_completed && difference < 0) return "期限超過";
  if (!schedule.is_completed && difference <= 3 * 86400000) return "3日以内";
  return null;
}

export function ScheduleList({ schedules, grouped = false }: { schedules: Schedule[]; grouped?: boolean }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const [filter, setFilter] = useState("all");
  const [currentTime] = useState(Date.now);
  const item = (schedule: Schedule) => {
    const label = urgency(schedule);
    return <li key={schedule.id} className="flex items-center gap-4 border-b px-5 py-4 last:border-0"><button disabled={pending} onClick={() => startTransition(async () => { const result = await toggleScheduleCompleted(schedule.id, !schedule.is_completed); if (result.error) setError(result.error); })} className={`flex size-6 shrink-0 items-center justify-center rounded border ${schedule.is_completed ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300"}`} aria-label="完了状態を変更">{schedule.is_completed && <Check className="size-4" />}</button><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className={`font-medium ${schedule.is_completed ? "text-slate-400 line-through" : ""}`}>{schedule.title}</p><span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{schedule.schedule_type}</span>{label && <span className={`rounded px-2 py-0.5 text-xs font-medium ${label === "期限超過" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>{label}</span>}</div><p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><Clock3 className="size-3.5" />{new Intl.DateTimeFormat("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Tokyo" }).format(new Date(schedule.start_at))}{schedule.company && <>　·　<Link className="text-blue-600 hover:underline" href={`/companies/${schedule.company.id}`}>{schedule.company.name}</Link></>}</p></div>{schedule.company_id && <ScheduleDialog companyId={schedule.company_id} schedule={schedule} triggerLabel="編集" />}<Button variant="ghost" size="sm" disabled={pending} onClick={() => startTransition(async () => { const result = await deleteSchedule(schedule.id); if (result.error) setError(result.error); })}><Trash2 className="size-4 text-red-600" /></Button></li>;
  };
  if (!grouped) return <>{error && <p className="mb-3 text-sm text-red-600">{error}</p>}<ul className="border bg-white">{schedules.map(item)}</ul></>;
  const filtered = schedules.filter((schedule) => filter === "all" || (filter === "upcoming" && !schedule.is_completed && new Date(schedule.start_at).getTime() >= currentTime) || (filter === "deadline" && schedule.is_deadline) || (filter === "interview" && schedule.schedule_type === "面接") || (filter === "briefing" && schedule.schedule_type === "説明会") || (filter === "completed" && schedule.is_completed) || (filter === "overdue" && !schedule.is_completed && new Date(schedule.start_at).getTime() < currentTime));
  const groups = filtered.reduce<Record<string, Schedule[]>>((all, schedule) => { const date = new Intl.DateTimeFormat("ja-JP", { month: "long", day: "numeric", weekday: "short", timeZone: "Asia/Tokyo" }).format(new Date(schedule.start_at)); (all[date] ??= []).push(schedule); return all; }, {});
  return <><div className="mb-5 flex flex-wrap gap-2">{[["all", "すべて"], ["upcoming", "今後の予定"], ["deadline", "締切"], ["interview", "面接"], ["briefing", "説明会"], ["completed", "完了済み"], ["overdue", "期限超過"]].map(([value, label]) => <button key={value} onClick={() => setFilter(value)} className={`rounded-md border px-3 py-1.5 text-sm ${filter === value ? "border-blue-600 bg-blue-50 text-blue-700" : "bg-white text-slate-600 hover:bg-slate-50"}`}>{label}</button>)}</div>{error && <p className="mb-3 text-sm text-red-600">{error}</p>}{Object.keys(groups).length ? <div className="space-y-6">{Object.entries(groups).map(([date, items]) => <section key={date}><h2 className="mb-2 text-sm font-semibold text-slate-600">{date}</h2><ul className="border bg-white">{items.map(item)}</ul></section>)}</div> : <div className="border bg-white p-10 text-center text-sm text-slate-500">条件に一致する予定はありません。</div>}</>;
}
