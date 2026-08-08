import { PageHeader } from "@/components/layout/page-header";
import { CompanyForm } from "@/components/companies/company-form";
import { createClient } from "@/lib/supabase/server";
export default async function NewCompanyPage() { const supabase = await createClient(); const { count } = await supabase.from("companies").select("id", { count: "exact", head: true }); return <><PageHeader title="企業を追加" description="応募企業の情報を登録します。" /><main className="p-8"><CompanyForm companyCount={count ?? 0} /></main></>; }
