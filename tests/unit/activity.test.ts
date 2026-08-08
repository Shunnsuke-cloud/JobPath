import { describe, expect, it } from "vitest";
import { scheduleSchema } from "@/lib/validations/activity";
import { STATUS_STYLES } from "@/lib/constants/companies";
describe("予定とステータス", () => { it("終了日時は開始日時より後", () => expect(scheduleSchema.safeParse({ title: "一次面接", scheduleType: "面接", startAt: "2026-08-10T14:00", endAt: "2026-08-10T13:00", isDeadline: false }).success).toBe(false)); it("内定のステータス表示を定義する", () => expect(STATUS_STYLES["内定"]).toContain("emerald")); });
