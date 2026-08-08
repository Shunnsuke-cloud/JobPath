"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, signupSchema, type LoginInput, type SignupInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = { mode: "login" | "signup" };
const errorMessage = (message: string) => message.includes("Invalid login") ? "メールアドレスまたはパスワードが正しくありません。" : message.includes("already registered") ? "このメールアドレスはすでに登録されています。" : "処理に失敗しました。時間をおいてもう一度お試しください。";

export function AuthForm({ mode }: Props) {
  const isSignup = mode === "signup";
  const router = useRouter();
  const [serverError, setServerError] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const form = useForm<LoginInput | SignupInput>({ resolver: zodResolver(isSignup ? signupSchema : loginSchema), defaultValues: isSignup ? { displayName: "", email: "", password: "", passwordConfirmation: "" } : { email: "", password: "" } });
  async function onSubmit(values: LoginInput | SignupInput) {
    setServerError(undefined); setNotice(undefined);
    const supabase = createClient();
    if (isSignup) {
      const data = values as SignupInput;
      const { data: result, error } = await supabase.auth.signUp({ email: data.email, password: data.password, options: { data: { display_name: data.displayName }, emailRedirectTo: `${window.location.origin}/dashboard` } });
      if (error) return setServerError(errorMessage(error.message));
      if (!result.session) return setNotice("確認メールを送信しました。メール内のリンクを開いて登録を完了してください。");
      router.replace("/dashboard"); router.refresh(); return;
    }
    const data = values as LoginInput;
    const { error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password });
    if (error) return setServerError(errorMessage(error.message));
    router.replace("/dashboard"); router.refresh();
  }
  const fieldError = (field: "displayName" | "email" | "password" | "passwordConfirmation") => {
    const errors = form.formState.errors as Partial<Record<"displayName" | "email" | "password" | "passwordConfirmation", { message?: string }>>;
    return errors[field]?.message;
  };
  return <div className="w-full max-w-md"><div className="mb-8"><h2 className="text-2xl font-semibold">{isSignup ? "アカウントを作成" : "ログイン"}</h2><p className="mt-2 text-sm text-slate-500">{isSignup ? "就職活動の整理を始めましょう。" : "JobPathへようこそ。"}</p></div><form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>{isSignup && <div className="space-y-2"><Label htmlFor="displayName">表示名</Label><Input id="displayName" placeholder="例：山田 太郎" {...form.register("displayName" as never)} />{fieldError("displayName") && <p className="text-sm text-red-600">{fieldError("displayName")}</p>}</div>}<div className="space-y-2"><Label htmlFor="email">メールアドレス</Label><Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...form.register("email")} />{fieldError("email") && <p className="text-sm text-red-600">{fieldError("email")}</p>}</div><div className="space-y-2"><Label htmlFor="password">パスワード</Label><Input id="password" type="password" autoComplete={isSignup ? "new-password" : "current-password"} {...form.register("password")} />{fieldError("password") && <p className="text-sm text-red-600">{fieldError("password")}</p>}</div>{isSignup && <div className="space-y-2"><Label htmlFor="passwordConfirmation">確認用パスワード</Label><Input id="passwordConfirmation" type="password" autoComplete="new-password" {...form.register("passwordConfirmation" as never)} />{fieldError("passwordConfirmation") && <p className="text-sm text-red-600">{fieldError("passwordConfirmation")}</p>}</div>}{serverError && <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{serverError}</p>}{notice && <p className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">{notice}</p>}<Button className="w-full" type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "処理中..." : isSignup ? "アカウントを作成" : "ログイン"}</Button></form><p className="mt-6 text-center text-sm text-slate-500">{isSignup ? "すでにアカウントをお持ちですか？" : "アカウントをお持ちでないですか？"} <Link className="font-medium text-blue-600 hover:underline" href={isSignup ? "/login" : "/signup"}>{isSignup ? "ログイン" : "新規登録"}</Link></p></div>;
}
