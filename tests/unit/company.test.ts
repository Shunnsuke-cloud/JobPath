import { describe, expect, it } from "vitest";
import { companySchema } from "@/lib/validations/company";
import { isCompanyLimitReached } from "@/lib/utils/company";
describe("企業登録バリデーション", () => { const valid = { name: "株式会社JobPath", currentStatus: "応募済み", interestLevel: 3 }; it("企業名は必須", () => expect(companySchema.safeParse({ ...valid, name: "" }).success).toBe(false)); it("志望度は1から5", () => { expect(companySchema.safeParse({ ...valid, interestLevel: 0 }).success).toBe(false); expect(companySchema.safeParse({ ...valid, interestLevel: 6 }).success).toBe(false); expect(companySchema.safeParse({ ...valid, interestLevel: 5 }).success).toBe(true); }); it("企業の登録上限を判定する", () => { expect(isCompanyLimitReached(99)).toBe(false); expect(isCompanyLimitReached(100)).toBe(true); }); });
