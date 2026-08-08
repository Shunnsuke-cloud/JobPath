import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) { return <input className={cn("flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-blue-100", className)} {...props} />; }
