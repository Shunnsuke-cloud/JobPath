"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Brand } from "./Visuals";
const links = [["特徴", "#story"], ["機能", "#features"], ["使い方", "#workflow"]];
export function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const update = () => header.current?.classList.toggle("is-scrolled", window.scrollY > 24);
    update(); window.addEventListener("scroll", update, { passive: true });
    const close = (event: KeyboardEvent) => { if (event.key === "Escape" && open) { setOpen(false); toggle.current?.focus(); } };
    const media = window.matchMedia("(min-width: 769px)");
    const resize = () => { if (media.matches) setOpen(false); };
    media.addEventListener("change", resize); window.addEventListener("keydown", close);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("keydown", close); media.removeEventListener("change", resize); };
  }, [open]);
  return <header ref={header} className={`jp-nav ${open ? "menu-open" : ""}`}><div className="jp-nav-inner">
    <Link href="/" aria-label="JobPath ホーム" className="jp-brand-link"><Brand /></Link>
    <nav className="jp-desktop-links" aria-label="メインナビゲーション">{links.map(([label, href]) => <a href={href} key={href}>{label}</a>)}</nav>
    <div className="jp-nav-actions"><Link href="/login" className="jp-login">ログイン</Link><Link href="/signup" className="jp-nav-cta">無料で始める <ArrowUpRight size={15} aria-hidden="true" /></Link></div>
    <button ref={toggle} className="jp-menu-toggle" type="button" aria-expanded={open} aria-controls="jp-mobile-menu" aria-label={open ? "メニューを閉じる" : "メニューを開く"} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    </div><nav id="jp-mobile-menu" className="jp-mobile-menu" aria-label="モバイルナビゲーション" inert={!open}>{links.map(([label, href], i) => <a href={href} key={href} onClick={() => setOpen(false)}><span>0{i + 1}</span>{label}<ArrowUpRight size={20} /></a>)}<Link href="/login" onClick={() => setOpen(false)}>ログイン<ArrowUpRight size={20} /></Link><Link href="/signup" onClick={() => setOpen(false)}>無料で始める<ArrowUpRight size={20} /></Link></nav></header>;
}
