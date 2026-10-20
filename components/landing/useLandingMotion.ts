"use client";
import { useEffect, type RefObject } from "react";

/** All animation state stays outside React. Reverting the media context also
 * removes every ScrollTrigger when navigating away or changing preferences. */
export function useLandingMotion(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let disposed = false;
    let revert: (() => void) | undefined;
    let frame = 0;
    let pointerFrame = 0;
    let activeCard: HTMLElement | null = null;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const progress = root.querySelector<HTMLElement>(".jp-scroll-progress");
    const updateProgress = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(updateProgress); };
    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    const resetCard = () => { activeCard?.style.removeProperty("--rx"); activeCard?.style.removeProperty("--ry"); activeCard = null; };
    const onPointer = (event: PointerEvent) => {
      if (reduce.matches || !fine.matches) return;
      const { clientX, clientY } = event;
      const card = (event.target as HTMLElement).closest<HTMLElement>("[data-tilt]");
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        root.style.setProperty("--pointer-x", `${(clientX / window.innerWidth - 0.5) * 36}px`);
        root.style.setProperty("--pointer-y", `${(clientY / window.innerHeight - 0.5) * 26}px`);
        if (activeCard !== card) resetCard();
        activeCard = card;
        if (card) {
          const box = card.getBoundingClientRect();
          const x = (clientX - box.left) / box.width;
          const y = (clientY - box.top) / box.height;
          card.style.setProperty("--rx", `${(0.5 - y) * 7}deg`);
          card.style.setProperty("--ry", `${(x - 0.5) * 7}deg`);
          card.style.setProperty("--spot-x", `${x * 100}%`);
          card.style.setProperty("--spot-y", `${y * 100}%`);
        }
      });
    };
    root.addEventListener("pointermove", onPointer, { passive: true });
    root.addEventListener("pointerleave", resetCard);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) entry.target.classList.toggle("jp-in-view", entry.isIntersecting);
    }, { rootMargin: "80px" });
    root.querySelectorAll("section").forEach((section) => observer.observe(section));

    async function animate() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      revert = () => media.revert();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".jp-hero .jp-letter", { y: 35, rotationX: -65, opacity: 0, stagger: 0.035, duration: 0.95, ease: "power3.out", clearProps: "all" });
        gsap.from(".jp-nav .jp-brand-mark i", { x: (i) => (i - 1) * 24, y: (i) => (i === 1 ? -25 : 20), rotation: 90, opacity: 0, stagger: 0.12, duration: 1, ease: "back.out(1.5)", clearProps: "all" });
        gsap.from(".jp-hero-dashboard", { y: 65, rotationY: 12, opacity: 0, duration: 1.4, delay: 0.2, ease: "power3.out" });
        root!.querySelectorAll<HTMLElement>(".jp-reveal").forEach((element, i) => {
          gsap.from(element, { y: 45, rotationX: 8, opacity: 0, duration: 0.9, delay: element.matches(".jp-feature-card") ? (i % 3) * 0.08 : 0, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 94%", once: true }, clearProps: "all" });
        });
      }, root!);
      media.add("(min-width: 901px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)", () => {
        root!.classList.add("jp-motion-desktop");
        gsap.to(".jp-hero-stage", { y: 100, rotationX: 7, rotationZ: 3, scale: 0.9, ease: "none", scrollTrigger: { trigger: ".jp-hero", start: "top top", end: "bottom top", scrub: 1 } });
        gsap.to(".jp-floating-interview", { y: -80, x: 25, ease: "none", scrollTrigger: { trigger: ".jp-hero", start: "top top", end: "bottom top", scrub: 1.5 } });
        gsap.to(".jp-floating-success", { y: -130, x: -30, ease: "none", scrollTrigger: { trigger: ".jp-hero", start: "top top", end: "bottom top", scrub: 1.8 } });
        const offsets = [[-315, -5, -16, 70], [300, -15, 12, -35], [-370, 130, -8, 35], [365, 145, 15, 80], [-190, 240, 10, -40], [170, 260, -12, 30]];
        gsap.set(".jp-chaos-card", { x: (i) => offsets[i][0], y: (i) => offsets[i][1], rotation: (i) => offsets[i][2], z: (i) => offsets[i][3] });
        const story = gsap.timeline({ scrollTrigger: { trigger: ".jp-problem", start: "top top", end: "bottom bottom", scrub: 1, invalidateOnRefresh: true } });
        story.to(".jp-chaos-card", { x: 0, y: 35, rotation: 0, z: -120, scale: 0.25, opacity: 0, stagger: 0.035, duration: 0.56, ease: "power2.inOut" }, 0.12)
          .to(".jp-chaos-center, .jp-chaos-orbit", { scale: 0.6, opacity: 0, duration: 0.4 }, 0.18)
          .fromTo(".jp-clarity-dashboard", { autoAlpha: 0, scale: 0.5, rotationX: 22, y: 35 }, { autoAlpha: 1, scale: () => Math.min(1, (window.innerHeight - 400) / 530), rotationX: 0, y: 0, duration: 0.45, ease: "power2.out" }, 0.5)
          .fromTo(".jp-clarity-copy", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2 }, 0.75)
          .to(".jp-story-meter i", { scaleX: 1, duration: 1, ease: "none" }, 0);
        const panels = gsap.utils.toArray<HTMLElement>(".jp-workflow-panel", root!);
        gsap.set(panels.slice(1), { autoAlpha: 0, y: 50 });
        const flow = gsap.timeline({ scrollTrigger: { trigger: ".jp-workflow", start: "top top", end: "bottom bottom", scrub: 0.7 } });
        panels.forEach((panel, i) => {
          if (i === 0) return;
          const at = i - 0.25;
          flow.to(panels[i - 1], { autoAlpha: 0, y: -45, duration: 0.28 }, at)
            .to(panel, { autoAlpha: 1, y: 0, duration: 0.35 }, at + 0.08)
            .from(panel.querySelector(".jp-workflow-window"), { rotationY: -12, rotationZ: -3, scale: 0.9, duration: 0.5 }, at + 0.08);
        });
        flow.to(".jp-workflow-track i", { scaleX: 1, duration: 3.2, ease: "none" }, 0)
          .to(".jp-workflow", { "--flow-hue": "80deg", duration: 3.2, ease: "none" }, 0);
        gsap.fromTo(".jp-cta-watermark", { scale: 0.78, y: 70 }, { scale: 1.08, y: -25, ease: "none", scrollTrigger: { trigger: ".jp-cta", start: "top bottom", end: "bottom bottom", scrub: 1 } });
        ScrollTrigger.refresh();
        return () => { root!.classList.remove("jp-motion-desktop"); };
      }, root!);
    }
    // Content remains visible and usable if the optional animation chunk fails.
    void animate().catch(() => { revert?.(); });
    return () => {
      disposed = true; revert?.(); observer.disconnect(); resetCard();
      cancelAnimationFrame(frame); cancelAnimationFrame(pointerFrame);
      window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll);
      root.removeEventListener("pointermove", onPointer); root.removeEventListener("pointerleave", resetCard);
    };
  }, [ref]);
}
