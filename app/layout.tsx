import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobPath | 就職活動を整理する",
  description: "就職活動中の企業・選考・予定を一元管理するPC向けWebアプリケーション",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
