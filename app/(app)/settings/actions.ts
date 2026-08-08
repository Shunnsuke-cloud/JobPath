"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const settingsSchema = z.object({ displayName: z.string().trim().min(1, "表示名を入力してください。").max(50, "表示名は50文字以内で入力してください。"), schoolName: z.string().trim().max(100, "学校名は100文字以内で入力してください。").optional(), graduationYear: z.coerce.number().int().min(2000, "卒業予定年度を正しく入力してください。").max(2100, "卒業予定年度を正しく入力してください。").optional() });
export type SettingsInput = z.input<typeof settingsSchema>;
export async function updateProfile(input: SettingsInput) { const parsed = settingsSchema.safeParse(input); if (!parsed.success) return { fieldErrors: Object.fromEntries(Object.entries(parsed.error.flatten().fieldErrors).map(([key, value]) => [key, value?.[0]])) }; const supabase = await createClient(); const { data } = await supabase.auth.getClaims(); const id = data?.claims?.sub; if (!id) return { error: "ログイン状態を確認できませんでした。再度ログインしてください。" }; const { error } = await supabase.from("profiles").update({ display_name: parsed.data.displayName, school_name: parsed.data.schoolName || null, graduation_year: parsed.data.graduationYear || null }).eq("id", id); if (error) { console.error("update profile", error); return { error: "アカウント設定の更新に失敗しました。" }; } revalidatePath("/settings"); revalidatePath("/dashboard"); return { success: true }; }
