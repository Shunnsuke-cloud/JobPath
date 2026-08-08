import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea className={cn("flex min-h-28 w-full rounded-md border bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-blue-100", className)} {...props} />; }
