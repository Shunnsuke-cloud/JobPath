import { Sidebar } from "@/components/layout/sidebar";
export function AppLayout({ children }: { children: React.ReactNode }) { return <div className="flex min-h-screen min-w-[1024px] bg-slate-50"><Sidebar /><div className="min-w-0 flex-1">{children}</div></div>; }
