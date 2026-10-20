"use client";
import { useRef } from "react";
import { ArrowDown, ArrowDownRight, ArrowUpRight, BookOpen, BriefcaseBusiness, CalendarDays, Check, CheckCheck, FileText, LayoutDashboard, ListChecks, MessageSquare, MoveUpRight, Sparkles } from "lucide-react";
import { LandingNavbar } from "./LandingNavbar";
import { MagneticButton } from "./MagneticButton";
import { Brand, DashboardVisual, MiniVisual } from "./Visuals";
import { useLandingMotion } from "./useLandingMotion";

const features = [
  { title: "ダッシュボード", en: "SEE THE BIG PICTURE", text: "応募企業や選考状況、予定を一覧で確認。今の自分の状況が、ひと目でわかる。", icon: LayoutDashboard },
  { title: "企業管理", en: "EVERY COMPANY, ONE PLACE", text: "気になる企業も、応募した企業も。情報をまとめて、自分だけの企業リストに。", icon: BriefcaseBusiness },
  { title: "選考管理", en: "KEEP YOUR MOMENTUM", text: "書類選考から面接まで。企業ごとの進捗を記録して、次のステップへ。", icon: ListChecks },
  { title: "スケジュール管理", en: "MAKE ROOM FOR WHAT’S NEXT", text: "面接予定も、提出期限も。大切な日程を整理して、余裕を持った準備を。", icon: CalendarDays },
  { title: "面接記録", en: "TURN EXPERIENCE INTO GROWTH", text: "質問や振り返りを残して、経験を次の面接の力に変える。", icon: MessageSquare },
  { title: "企業研究", en: "GO BEYOND THE SURFACE", text: "事業内容、強み、志望動機。企業ごとの研究情報を、いつでも見返せる場所に。", icon: BookOpen },
];
const steps = [
  { title: "企業を登録", text: "気になる企業や応募した企業を記録。\nあなただけの就活の地図をつくろう。", label: "BUILD YOUR OWN MAP", visual: 1 },
  { title: "選考状況を記録", text: "各企業の選考進捗を把握。\n小さな前進も、しっかり見える形に。", label: "EVERY STEP COUNTS", visual: 2 },
  { title: "予定と締切を整理", text: "面接や提出期限をまとめて管理。\n準備に集中できる、心の余白を。", label: "STAY ONE STEP AHEAD", visual: 3 },
  { title: "次の行動を明確に", text: "今やるべきことを確認。\n迷う時間を、未来に進む時間に変える。", label: "FOCUS ON YOUR NEXT MOVE", visual: 0 },
];
const chaos = [
  { icon: BriefcaseBusiness, title: "応募企業", text: "気になる企業が、また増えた。", tag: "COMPANIES", color: "purple" },
  { icon: CalendarDays, title: "面接予定", text: "次の面接、いつだっけ？", tag: "SCHEDULE", color: "blue" },
  { icon: ListChecks, title: "選考ステータス", text: "あの企業、いまどの段階？", tag: "PROGRESS", color: "cyan" },
  { icon: BookOpen, title: "企業研究メモ", text: "調べた情報、どこに保存した？", tag: "RESEARCH", color: "purple" },
  { icon: FileText, title: "締切情報", text: "エントリーシート、提出した？", tag: "DEADLINE", color: "blue" },
  { icon: CheckCheck, title: "やることリスト", text: "何から手をつければいい？", tag: "TO DO", color: "cyan" },
];
function SplitText({ text }: { text: string }) { return <span aria-label={text}>{Array.from(text).map((char, i) => <span className="jp-letter" aria-hidden="true" style={{ "--i": i } as React.CSSProperties} key={i}>{char}</span>)}</span>; }
function Eyebrow({ number, children }: { number: string; children: React.ReactNode }) { return <div className="jp-eyebrow"><span>{number}</span><i />{children}</div>; }

export function LandingPage() {
  const root = useRef<HTMLDivElement>(null);
  useLandingMotion(root);
  return <div ref={root} className="jp-landing">
    <a className="jp-skip" href="#main-content">本文へスキップ</a><div className="jp-scroll-progress" aria-hidden="true" /><LandingNavbar />
    <main id="main-content">
      <section className="jp-hero" aria-labelledby="hero-heading">
        <div className="jp-hero-light" aria-hidden="true" /><div className="jp-hero-grid" aria-hidden="true" />
        <div className="jp-particles" aria-hidden="true">{Array.from({ length: 22 }, (_, i) => <i key={i} style={{ "--i": i, left: `${(i * 37 + 13) % 100}%`, top: `${(i * 19 + 7) % 100}%` } as React.CSSProperties} />)}</div>
        <div className="jp-hero-content jp-container"><div className="jp-hero-copy"><div className="jp-hero-kicker"><span className="jp-live-dot" /> YOUR NEXT CHAPTER STARTS HERE</div>
          <h1 id="hero-heading"><SplitText text="就活のすべてを、" /><br /><span className="jp-gradient-text"><SplitText text="ひとつの場所に。" /></span></h1>
          <p className="jp-hero-description">企業研究も、選考管理も、面接準備も。<br />散らばる就活情報を整理して、<br className="jp-mobile-break" />次にやるべきことを明確に。</p>
          <div className="jp-hero-buttons"><MagneticButton /><MagneticButton secondary href="/login">ログイン</MagneticButton></div>
          <div className="jp-hero-note"><span><Check size={13} />無料でスタート</span><i /><span>あなたの就活に、ひとつの場所を。</span></div>
        </div><div className="jp-hero-stage" aria-label="企業・選考・予定を一元管理するダッシュボードのイメージ">
          <div className="jp-orbit jp-orbit-one" aria-hidden="true" /><div className="jp-orbit jp-orbit-two" aria-hidden="true" /><span className="jp-stage-label">A CLEARER PATH TO YOUR FUTURE</span>
          <div className="jp-hero-dashboard"><DashboardVisual /></div>
          <div className="jp-floating-card jp-floating-interview" aria-hidden="true"><span className="jp-floating-icon"><CalendarDays size={18} /></span><div><small>UP NEXT</small><b>次のチャンスへ。</b><p>二次面接 <span>10:00 – 11:00</span></p></div><span className="jp-live-dot" /></div>
          <div className="jp-floating-card jp-floating-success" aria-hidden="true"><span className="jp-success-icon"><Check size={18} /></span><div><small>ONE STEP FORWARD</small><b>書類選考、通過！</b></div><Sparkles size={18} /></div>
          <div className="jp-stage-coordinate" aria-hidden="true"><span>35° → YOUR FUTURE</span><i /><span>CONNECTED.</span></div>
        </div></div>
        <div className="jp-hero-bottom jp-container"><a href="#story" className="jp-scroll-cue"><span className="jp-scroll-mouse"><i /></span>SCROLL TO EXPLORE<ArrowDown size={13} /></a><span className="jp-hero-bottom-copy">LESS CHAOS.<span> MORE CLARITY.</span></span><span className="jp-page-index">01 — 05</span></div>
      </section>
      <section id="story" className="jp-problem" aria-labelledby="problem-heading"><div className="jp-problem-sticky">
        <div className="jp-container jp-problem-heading"><Eyebrow number="01">FROM CHAOS TO CLARITY</Eyebrow><h2 id="problem-heading" className="jp-reveal">就活の情報、<br className="jp-mobile-break" />散らばっていませんか？</h2><p className="jp-section-description jp-reveal">増えていく企業、迫る締切、あちこちに残したメモ。<br />その「管理する大変さ」を、手放そう。</p></div>
        <div className="jp-chaos-scene jp-container"><div className="jp-chaos-orbit" aria-hidden="true" /><div className="jp-chaos-center" aria-hidden="true"><Brand compact /><span>BRING IT ALL TOGETHER</span></div>
          <div className="jp-chaos-cards">{chaos.map(({ icon: Icon, title, text, tag, color }, i) => <div className={`jp-chaos-card jp-chaos-${i} ${color}`} key={title}><div><Icon size={19} /><span>{tag}</span><ArrowUpRight size={14} /></div><h3>{title}</h3><p>{text}</p><div className="jp-chaos-lines"><i /><i /></div></div>)}</div>
          <div className="jp-clarity-dashboard"><DashboardVisual /></div>
        </div><div className="jp-clarity-copy"><span className="jp-micro">EVERYTHING IN ITS RIGHT PLACE.</span><h3>散らばった情報を、<span>ひとつに。</span></h3></div>
        <div className="jp-story-meter"><span>CHAOS</span><div><i /></div><span>CLARITY</span><ArrowDownRight size={16} /></div>
      </div></section>
      <section id="features" className="jp-features jp-container" aria-labelledby="features-heading">
        <div className="jp-section-heading"><div><Eyebrow number="02">DESIGNED FOR YOUR JOURNEY</Eyebrow><h2 id="features-heading" className="jp-reveal">就活に必要な情報を、<br /><span className="jp-muted-heading">まとめて管理。</span></h2></div><p className="jp-section-description jp-reveal">管理に追われる就活から、<br />自分の未来に向き合う就活へ。</p></div>
        <div className="jp-bento">{features.map(({ icon: Icon, title, en, text }, i) => <article className={`jp-feature-card jp-feature-${i} jp-reveal`} data-tilt key={title}><div className="jp-feature-top"><span className="jp-feature-icon"><Icon size={20} /></span><span className="jp-feature-number">0{i + 1}<MoveUpRight size={14} /></span></div><div className="jp-feature-copy"><span className="jp-micro">{en}</span><h3>{title}</h3><p>{text}</p></div><MiniVisual type={i} /></article>)}</div>
        <div className="jp-feature-end"><span /><Sparkles size={14} /><p>つながる情報。ひろがる可能性。</p><span /></div>
      </section>
      <section id="workflow" className="jp-workflow" aria-labelledby="workflow-heading"><div className="jp-workflow-sticky jp-container">
        <div className="jp-workflow-header"><Eyebrow number="03">A SIMPLE WAY FORWARD</Eyebrow><h2 id="workflow-heading">就活を、<br /><span className="jp-gradient-text">もっとシンプルに。</span></h2><p className="jp-section-description">はじめの一歩から、次のチャンスまで。<br />やるべきことが、自然と見えてくる。</p><div className="jp-workflow-track" aria-hidden="true"><i />{steps.map((_, i) => <span key={i}>0{i + 1}</span>)}</div></div>
        <div className="jp-workflow-panels">{steps.map((step, i) => <article className={`jp-workflow-panel jp-workflow-panel-${i}`} key={step.title}><div className="jp-step-copy"><span className="jp-step-index">STEP <strong>0{i + 1}</strong><span>/ 04</span></span><span className="jp-micro">{step.label}</span><h3>{step.title}</h3><p>{step.text}</p></div><div className="jp-step-visual" aria-hidden="true"><div className="jp-step-orbit" /><span className="jp-step-watermark">0{i + 1}</span><div className="jp-workflow-window"><div className="jp-window-bar"><Brand compact /><span>YOUR NEXT STEP</span><span>0{i + 1} / 04</span></div><MiniVisual type={step.visual} /><div className="jp-workflow-window-caption"><span className="jp-live-dot" />{step.title}<ArrowUpRight size={15} /></div></div><span className="jp-step-annotation"><span />{["すべての可能性を、ここに。", "積み重ねた一歩を、見える形に。", "大切なチャンスを、見失わない。", "さあ、あなたの次の一歩へ。"][i]}</span></div></article>)}</div>
      </div></section>
      <section className="jp-cta" aria-labelledby="cta-heading"><div className="jp-cta-glow" aria-hidden="true" /><div className="jp-cta-orbit" aria-hidden="true" /><div className="jp-cta-watermark" aria-hidden="true">JobPath<span>.</span></div><div className="jp-cta-content jp-container"><span className="jp-hero-kicker"><span className="jp-live-dot" /> YOUR FUTURE IS CALLING</span><h2 id="cta-heading" className="jp-reveal">就活の次の一歩を、<br /><span className="jp-gradient-text">ここから。</span></h2><p className="jp-reveal">情報を整理すれば、やるべきことが見えてくる。<br />JobPathで、あなたの就活をもっとわかりやすく。</p><MagneticButton className="jp-cta-button" /><span className="jp-cta-small">あなたの可能性に、まっすぐに。</span></div></section>
    </main>
    <footer className="jp-footer jp-container"><a href="#main-content" aria-label="ページの先頭へ"><Brand /></a><p>あなたの就活に、ひとつの場所を。</p><div><a href="#features">機能</a><a href="#workflow">使い方</a><a href="/login">ログイン<ArrowUpRight size={12} /></a></div><span>© {new Date().getUTCFullYear()} JobPath</span></footer>
  </div>;
}
