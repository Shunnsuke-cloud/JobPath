import { z } from "zod";
import { SCHEDULE_TYPES, SELECTION_EVENT_TYPES } from "@/lib/constants/companies";
const requiredDate = z.string().min(1, "日時を入力してください。").refine((value) => !Number.isNaN(new Date(value).getTime()), "日時の形式が正しくありません。");
export const selectionEventSchema = z.object({ eventType: z.enum(SELECTION_EVENT_TYPES), title: z.string().trim().min(1, "タイトルを入力してください。").max(100, "タイトルは100文字以内で入力してください。"), eventDate: requiredDate, result: z.string().trim().max(100, "結果は100文字以内で入力してください。").optional(), memo: z.string().trim().max(3000, "メモは3,000文字以内で入力してください。").optional() });
export const scheduleSchema = z.object({ title: z.string().trim().min(1, "タイトルを入力してください。").max(100, "タイトルは100文字以内で入力してください。"), scheduleType: z.enum(SCHEDULE_TYPES), startAt: requiredDate, endAt: z.string().optional(), isDeadline: z.boolean(), memo: z.string().trim().max(3000, "メモは3,000文字以内で入力してください。").optional() }).superRefine((value, ctx) => { if (value.endAt && !Number.isNaN(new Date(value.endAt).getTime()) && new Date(value.endAt) <= new Date(value.startAt)) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["endAt"], message: "終了日時は開始日時より後にしてください。" }); });
export type SelectionEventInput = z.infer<typeof selectionEventSchema>;
export type ScheduleInput = z.infer<typeof scheduleSchema>;
