import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function CompanyNotFound() { return <div className="p-8"><h1 className="text-xl font-semibold">企業が見つかりません</h1><p className="mt-2 text-sm text-slate-500">削除されたか、アクセス権がありません。</p><Button asChild className="mt-5"><Link href="/companies">企業一覧へ戻る</Link></Button></div>; }
