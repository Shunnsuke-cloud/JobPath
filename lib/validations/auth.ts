import { z } from "zod";

export const loginSchema = z.object({ email: z.string().min(1, "メールアドレスを入力してください。").email("メールアドレスの形式が正しくありません。"), password: z.string().min(1, "パスワードを入力してください。") });
export const signupSchema = loginSchema.extend({ displayName: z.string().trim().min(1, "表示名を入力してください。").max(50, "表示名は50文字以内で入力してください。"), password: z.string().min(8, "パスワードは8文字以上で入力してください。"), passwordConfirmation: z.string().min(1, "確認用パスワードを入力してください。") }).refine((data) => data.password === data.passwordConfirmation, { path: ["passwordConfirmation"], message: "パスワードが一致しません。" });
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
