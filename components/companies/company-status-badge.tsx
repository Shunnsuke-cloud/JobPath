import { cn } from "@/lib/utils";
import { STATUS_STYLES } from "@/lib/constants/companies";
import type { CompanyStatus } from "@/types/database";
export function CompanyStatusBadge({ status }: { status: CompanyStatus }) { return <span className={cn("inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium", STATUS_STYLES[status])}>{status}</span>; }
