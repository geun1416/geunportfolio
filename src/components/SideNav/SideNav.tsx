import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CHAPTERS, panelsOf, workPanelIndex } from "../../data/chapters";
import type { ChapterActive } from "../Chapter/Chapter";
import "./SideNav.css";

gsap.registerPlugin(ScrollTrigger);

// chapter -1: 인트로 구간 / 0~3: 챕터 / -2: 마지막 챕터 이후(숨김)
function SideNav() {
  const navRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<ChapterActive>({ chapter: -1, panel: 0 });

  useEffect(() => {
    const onActive = (e: Event) => setActive((e as CustomEvent<ChapterActive>).detail);
    window.addEventListener("chapter:active", onActive);
    return () => window.removeEventListener("chapter:active", onActive);
  }, []);

  useEffect(() => {
    const nav = navRef.current!;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduce) {
        gsap.from(nav.querySelectorAll(".side-nav__item"), { autoAlpha: 0, x: 16, duration: 0.5, stagger: 0.08, delay: 0.9, ease: "power3.out" });
      }
      // 인트로를 벗어나는 동안 큰 목록 → 오른쪽 끝의 작은 목차로 줄어듦
      gsap.to(nav, {
        scale: 0.55,
        x: () => window.innerWidth * 0.08 - 40,
        ease: "none",
        scrollTrigger: { trigger: ".intro", start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true },
      });
    });

    return () => mm.revert();
  }, []);

  const goTo = (chapter: number, panel = 0) => window.dispatchEvent(new CustomEvent<ChapterActive>("chapter:goto", { detail: { chapter, panel } }));

  const inChapter = active.chapter >= 0;

  return (
    <nav ref={navRef} className={`side-nav${inChapter ? " is-compact" : ""}${active.chapter === -2 ? " is-hidden" : ""}`} aria-label="포트폴리오 목차">
      <ul className="side-nav__list">
        {CHAPTERS.map((ch, ci) => {
          const isActive = active.chapter === ci;
          // 챕터 표지(목차)에서는 작업물 목록을 펼치지 않고, 01번 작업물부터 펼침
          const isOpen = isActive && active.panel > 0;
          const panels = panelsOf(ch);
          // 현재 장이 속한 작업물 번호 (표지면 -1)
          const p = panels[active.panel];
          const activeWork = isActive && p && p.kind !== "cover" ? p.index : -1;
          return (
            <li key={ch.id} className="side-nav__group">
              <button
                type="button"
                className={`side-nav__item${isActive ? " is-active" : ""}`}
                style={{ "--kw": `var(${ch.token})` } as React.CSSProperties}
                onClick={() => goTo(ci)}
                aria-current={isActive ? "true" : undefined}
              >
                <span className="side-nav__text">{ch.text}</span>
              </button>
              <ul className={`side-nav__works${isOpen ? " is-open" : ""}`} style={{ "--kw": `var(${ch.token})` } as React.CSSProperties}>
                {ch.works.map((w, wi) => (
                  <li key={w.id}>
                    <button type="button" className={`side-nav__work${activeWork === wi ? " is-active" : ""}`} onClick={() => goTo(ci, workPanelIndex(ch, wi))} tabIndex={isOpen ? 0 : -1}>
                      {w.title}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default SideNav;
