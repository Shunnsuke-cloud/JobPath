import type { CompanyStatus } from "@/types/database";

export const COMPANY_TYPES = ["自社開発", "SIer", "受託開発", "SES", "コンサル", "その他"] as const;
export const COMPANY_STATUSES = ["興味あり", "応募予定", "応募済み", "説明会参加", "書類選考", "適性検査", "一次面接", "二次面接", "最終面接", "内定", "不合格", "辞退"] as const satisfies readonly CompanyStatus[];
export const STATUS_STYLES: Record<CompanyStatus, string> = { "興味あり": "bg-slate-100 text-slate-700", "応募予定": "bg-sky-100 text-sky-700", "応募済み": "bg-blue-100 text-blue-700", "説明会参加": "bg-cyan-100 text-cyan-700", "書類選考": "bg-violet-100 text-violet-700", "適性検査": "bg-purple-100 text-purple-700", "一次面接": "bg-orange-100 text-orange-700", "二次面接": "bg-orange-100 text-orange-700", "最終面接": "bg-amber-100 text-amber-800", "内定": "bg-emerald-100 text-emerald-700", "不合格": "bg-red-100 text-red-700", "辞退": "bg-slate-700 text-white" };
export const INTEREST_LABELS = ["", "低い", "やや低い", "普通", "高い", "非常に高い"] as const;
export const SCHEDULE_TYPES = ["面接", "説明会", "ES提出期限", "適性検査期限", "返信期限", "インターン日程", "その他"] as const;
export const SELECTION_EVENT_TYPES = ["興味を持った", "説明会参加", "応募", "ES提出", "書類選考", "適性検査", "一次面接", "二次面接", "最終面接", "内定", "不合格", "辞退", "その他"] as const;
