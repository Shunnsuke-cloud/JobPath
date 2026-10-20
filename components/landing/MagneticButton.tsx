"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PointerEvent } from "react";

export function MagneticButton({ children = "無料で始める", href = "/signup", secondary = false, className = "" }: { children?: React.ReactNode; href?: string; secondary?: boolean; className?: string }) {
  function move(event: PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${(event.clientX - rect.left - rect.width / 2) * 0.14}px`);
    event.currentTarget.style.setProperty("--my", `${(event.clientY - rect.top - rect.height / 2) * 0.18}px`);
  }
  return <Link href={href} className={`jp-button ${secondary ? "jp-button-secondary" : ""} ${className}`} onPointerMove={move} onPointerLeave={(event) => { event.currentTarget.style.setProperty("--mx", "0px"); event.currentTarget.style.setProperty("--my", "0px"); }}><span>{children}</span><ArrowUpRight size={17} aria-hidden="true" /></Link>;
}
