import { describe, expect, it } from "vitest";
import { getDashboardCounts, getScheduleState } from "@/lib/utils/dashboard";

describe("ダッシュボード集計", () => {
  const now = Date.parse("2026-08-01T00:00:00Z");

  it("完了済みを除いて今後7日間の予定を集計する", () => {
    expect(getDashboardCounts(
      ["応募済み", "内定", "不合格", "一次面接"],
      [
        { start_at: "2026-08-02T00:00:00Z", is_completed: false, is_deadline: false },
        { start_at: "2026-08-03T00:00:00Z", is_completed: true, is_deadline: false },
        { start_at: "2026-08-10T00:00:00Z", is_completed: false, is_deadline: false },
      ],
      now,
    )).toEqual({ totalCompanies: 4, activeCompanies: 2, upcomingSchedules: 1, offers: 1 });
  });

  it("過去の面接と期限超過を区別する", () => {
    expect(getScheduleState({ start_at: "2026-07-31T00:00:00Z", is_completed: false, is_deadline: false, schedule_type: "面接" }, now)).toBe("終了");
    expect(getScheduleState({ start_at: "2026-07-31T00:00:00Z", is_completed: false, is_deadline: true }, now)).toBe("期限超過");
  });
});
