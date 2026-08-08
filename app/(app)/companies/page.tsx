import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { CompanyTable } from "@/components/companies/company-table";
import { createClient } from "@/lib/supabase/server";
export default async function CompaniesPage() { const supabase = await createClient(); const { data: companies, error } = await supabase.from("companies").select("*").order("updated_at", { ascending: false }); return <><PageHeader title="企業一覧" description="応募企業と選考状況を管理します。" actions={<Button asChild><Link href="/companies/new"><Plus className="mr-2 size-4" />企業を追加</Link></Button>} /><main className="mx-auto max-w-[1440px] p-8">{error ? <p className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">企業情報を取得できませんでした。時間をおいて再読み込みしてください。</p> : companies && companies.length > 0 ? <CompanyTable companies={companies} /> : <div className="border bg-white px-8 py-20 text-center"><h2 className="text-lg font-semibold">まだ企業が登録されていません。</h2><p className="mt-2 text-sm text-slate-500">最初の企業を登録して、就職活動を整理しましょう。</p><Button asChild className="mt-6"><Link href="/companies/new"><Plus className="mr-2 size-4" />最初の企業を登録</Link></Button></div>}</main></>; }
