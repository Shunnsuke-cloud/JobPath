import { z } from "zod";
import { COMPANY_STATUSES, COMPANY_TYPES } from "@/lib/constants/companies";

const optionalText = z.string().trim().max(500, "500文字以内で入力してください。").optional().transform((value) => value || null);
const optionalUrl = z.string().trim().url("URLの形式が正しくありません。").optional().or(z.literal("")).transform((value) => value || null);
export const companySchema = z.object({ name: z.string().trim().min(1, "企業名を入力してください。").max(100, "企業名は100文字以内で入力してください。"), industry: optionalText, companyType: z.enum(COMPANY_TYPES).optional().or(z.literal("")).transform((value) => value || null), jobPosition: optionalText, location: optionalText, currentStatus: z.enum(COMPANY_STATUSES), interestLevel: z.coerce.number().int().min(1, "志望度は1から5の範囲で選択してください。").max(5, "志望度は1から5の範囲で選択してください。"), applicationSource: optionalText, jobUrl: optionalUrl, corporateUrl: optionalUrl, memo: z.string().trim().max(5000, "メモは5,000文字以内で入力してください。").optional().transform((value) => value || null) });
export type CompanyInput = z.input<typeof companySchema>;
export type CompanyValues = z.output<typeof companySchema>;
