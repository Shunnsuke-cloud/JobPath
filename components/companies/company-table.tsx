"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { RotateCcw, Search } from "lucide-react";
import { COMPANY_STATUSES, COMPANY_TYPES, INTEREST_LABELS } from "@/lib/constants/companies";
import { CompanyStatusBadge } from "@/components/companies/company-status-badge";
import { Button } from "@/components/ui/button";
import type { Database } from "@/types/database";

type Company = Database["public"]["Tables"]["companies"]["Row"];
export type CompanyFilters = { q: string; status: string; type: string; interest: string; sort: string };

export function CompanyTable({ companies, initialFilters }: { companies: Company[]; initialFilters: CompanyFilters }) {
  const [search, setSearch] = useState(initialFilters.q);
  const [status, setStatus] = useState(initialFilters.status);
  const [type, setType] = useState(initialFilters.type);
  const [interest, setInterest] = useState(initialFilters.interest);
  const [sort, setSort] = useState(initialFilters.sort || "updated");
  const [page, setPage] = useState(1);

  function persist(next: CompanyFilters) {
    const params = new URLSearchParams();
    if (next.q) params.set("q", next.q);
    if (next.status) params.set("status", next.status);
    if (next.type) params.set("type", next.type);
    if (next.interest) params.set("interest", next.interest);
    if (next.sort !== "updated") params.set("sort", next.sort);
    window.history.replaceState(null, "", `/companies${params.size ? `?${params}` : ""}`);
  }

  function change(values: Partial<CompanyFilters>) {
    const next = { q: search, status, type, interest, sort, ...values };
    if (values.q !== undefined) setSearch(values.q);
    if (values.status !== undefined) setStatus(values.status);
    if (values.type !== undefined) setType(values.type);
    if (values.interest !== undefined) setInterest(values.interest);
    if (values.sort !== undefined) setSort(values.sort);
    setPage(1);
    persist(next);
  }

  function clearFilters() { change({ q: "", status: "", type: "", interest: "", sort: "updated" }); }

  const filtered = useMemo(() => companies.filter((company) =>
    (!search || company.name.toLowerCase().includes(search.toLowerCase())) &&
    (!status || company.current_status === status) &&
    (!type || company.company_type === type) &&
    (!interest || company.interest_level === Number(interest))
  ).sort((a, b) => sort === "name" ? a.name.localeCompare(b.name, "ja") : sort === "interest" ? (b.interest_level ?? 0) - (a.interest_level ?? 0) : new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()), [companies, search, status, type, interest, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / 20));
  const pageItems = filtered.slice((page - 1) * 20, page * 20);
  const hasConditions = Boolean(search || status || type || interest || sort !== "updated");
  const returnParams = new URLSearchParams();
  if (search) returnParams.set("q", search);
  if (status) returnParams.set("status", status);
  if (type) returnParams.set("type", type);
  if (interest) returnParams.set("interest", interest);
  if (sort !== "updated") returnParams.set("sort", sort);
  const returnTo = `/companies${returnParams.size ? `?${returnParams}` : ""}`;

  return <>
    <section className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex flex-wrap gap-3">
        <label className="relative min-w-64 flex-1"><span className="sr-only">企業名で検索</span><Search className="absolute left-3 top-3 size-4 text-slate-400" /><input className="h-10 w-full rounded-lg border pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-blue-100" value={search} onChange={(event) => change({ q: event.target.value })} placeholder="企業名で検索" /></label>
        <Filter label="選考状況" value={status} onChange={(value) => change({ status: value })}><option value="">すべて</option>{COMPANY_STATUSES.map((item) => <option key={item}>{item}</option>)}</Filter>
        <Filter label="志望度" value={interest} onChange={(value) => change({ interest: value })}><option value="">すべて</option>{[1,2,3,4,5].map((item) => <option key={item} value={item}>{item}：{INTEREST_LABELS[item]}</option>)}</Filter>
        <Filter label="企業区分" value={type} onChange={(value) => change({ type: value })}><option value="">すべて</option>{COMPANY_TYPES.map((item) => <option key={item}>{item}</option>)}</Filter>
        <Filter label="並び順" value={sort} onChange={(value) => change({ sort: value })}><option value="updated">更新日が新しい順</option><option value="interest">志望度が高い順</option><option value="name">企業名順</option></Filter>
      </div>
      <div className="mt-4 flex items-center justify-between border-t pt-4">
        <p className="text-sm text-slate-600"><span className="font-semibold text-slate-900">{companies.length}件</span> 登録済み・検索結果 <span className="font-semibold text-slate-900">{filtered.length}件</span></p>
        <Button type="button" variant="ghost" size="sm" disabled={!hasConditions} onClick={clearFilters}><RotateCcw className="mr-2 size-4" />条件をクリア</Button>
      </div>
    </section>

    <div className="mt-4 overflow-hidden rounded-xl border bg-white shadow-sm"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr>{["企業名", "企業区分", "応募職種", "現在の選考状況", "志望度", "応募経路", "更新日", "操作"].map((label) => <th key={label} className="whitespace-nowrap px-4 py-3 font-medium">{label}</th>)}</tr></thead><tbody className="divide-y">{pageItems.map((company) => {
      const detailHref = `/companies/${company.id}?from=${encodeURIComponent(returnTo)}`;
      return <tr key={company.id} className="hover:bg-slate-50"><td className="px-4 py-4"><Link className="font-semibold text-slate-900 hover:text-blue-600 hover:underline" href={detailHref}>{company.name}</Link></td><td className="px-4 py-4 text-slate-600">{company.company_type ?? "—"}</td><td className="px-4 py-4 text-slate-600">{company.job_position ?? "—"}</td><td className="px-4 py-4"><CompanyStatusBadge status={company.current_status} /></td><td className="px-4 py-4 font-medium">{company.interest_level ? `${company.interest_level} / 5` : "—"}</td><td className="px-4 py-4 text-slate-600">{company.application_source ?? "—"}</td><td className="whitespace-nowrap px-4 py-4 text-slate-600">{new Intl.DateTimeFormat("ja-JP", { month: "numeric", day: "numeric" }).format(new Date(company.updated_at))}</td><td className="px-4 py-4"><Link href={`/companies/${company.id}/edit`} className="font-medium text-blue-600 hover:underline" aria-label={`${company.name}を編集`}>編集</Link></td></tr>;
    })}{pageItems.length === 0 && <tr><td colSpan={8} className="px-4 py-16 text-center text-slate-500">条件に一致する企業がありません。</td></tr>}</tbody></table></div>
    {filtered.length > 20 && <div className="mt-4 flex items-center justify-between text-sm text-slate-600"><span>{filtered.length}件中 {(page - 1) * 20 + 1}〜{Math.min(page * 20, filtered.length)}件</span><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>前へ</Button><Button variant="outline" size="sm" disabled={page === pageCount} onClick={() => setPage((value) => value + 1)}>次へ</Button></div></div>}
  </>;
}

function Filter({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return <label className="text-xs font-medium text-slate-500"><span className="mb-1 block">{label}</span><select className="h-10 rounded-lg border bg-white px-3 text-sm text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-blue-100" value={value} onChange={(event) => onChange(event.target.value)}>{children}</select></label>;
}
