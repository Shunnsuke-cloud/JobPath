import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/LandingPage";
import "@/components/landing/landing.css";

const title = "JobPath | 就活のすべてを、ひとつの場所に。";
const description = "企業研究も、選考管理も、面接準備も。散らばる就活情報を整理して、次にやるべきことを明確に。学生のための就活管理アプリ、JobPath。";
export const metadata: Metadata = {
  title, description,
  openGraph: { title, description, siteName: "JobPath", locale: "ja_JP", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function HomePage() {
  return <LandingPage />;
}
