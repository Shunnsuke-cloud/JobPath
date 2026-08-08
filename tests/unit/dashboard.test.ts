import { describe, expect, it } from "vitest";
import { getDashboardCounts } from "@/lib/utils/dashboard";
describe("ダッシュボード集計", () => { it("企業・予定・内定を集計する", () => { const now = Date.parse("2026-08-01T00:00:00Z"); expect(getDashboardCounts(["応募済み", "内定", "不合格", "一次面接"], ["2026-08-02T00:00:00Z", "2026-08-10T00:00:00Z"], now)).toEqual({ totalCompanies: 4, activeCompanies: 2, upcomingSchedules: 1, offers: 1 }); }); });
