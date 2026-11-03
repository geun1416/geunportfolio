import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToY } from "../../lib/scroll";
import "./Hero.css";

gsap.registerPlugin(ScrollTrigger);

export const HERO_PAGES = [
  { text: "Strategy", sub: "Research, planning, and structuring the problem", token: "--kw-strategy" },
  { text: "Design", sub: "UI/UX, visual systems, and interaction design", token: "--kw-design" },
  { text: "Proposal", sub: "Proposals, IR decks, and documents that persuade", token: "--kw-proposal" },
  { text: "Lead", sub: "Directing teams and owning outcomes", token: "--kw-lead" },
] as const;

// 테마별 실제 색상값(HEX)을 CSS 변수에서 읽어옴
const tokenValue = (token: string) => getComputedStyle(document.documentElement).getPropertyValue(token).trim().toUpperCase();

// 시간 예산 (초 단위)
const ENTER = 1; // 단어 중앙 → 왼쪽위 이동
const OVERLAP = 0.6; // 서브/박스가 겹쳐서 시작하는 정도
const DWELL = 1.2; // 완성 후 멈춤
const COVER = 1.2; // 원 확장
const REVEAL = 1.2; // 원 축소
const PAUSE = 0.6; // 걷힌 후 중앙 멈춤
const BADGE_STAGGER = 0.08; // 배지 순차 등장 간격
const BADGE_DURATION = 0.4; // 배지 개별 등장 시간
const TEXT_DURATION = 0.5; // 설명 텍스트 등장 시간
const TEXT_OVERLAP = 0.1; // 배지 끝나기 살짝 전에 텍스트 시작

const PAGE_DURATION = ENTER + DWELL;
const TRANSITION_DURATION = COVER + REVEAL + PAUSE;
// 타임라인 1초당 스크롤 길이(화면 높이 %) — 기존 120에서 1/3로 단축
const SCROLL_PER_SECOND = 40;

const pageStart = (i: number) => i * (PAGE_DURATION + TRANSITION_DURATION);

function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const breadcrumbRef = useRef<HTMLDivElement>(null);
  const hexRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<HTMLSpanElement[]>([]);
  const subRefs = useRef<HTMLDivElement[]>([]);
  const boxRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const circle = circleRef.current;
    const words = wordRefs.current;
    const subs = subRefs.current;
    const boxes = boxRefs.current;
    const total = HERO_PAGES.length;
    const mm = gsap.matchMedia();

    // 배지들 stagger 등장에 걸리는 총 시간 계산
    const badgesTotalDuration = (badges: NodeListOf<Element>) => (badges.length ? BADGE_DURATION + (badges.length - 1) * BADGE_STAGGER : 0);

    mm.add({ isMobile: "(max-width: 768px)", isDesktop: "(min-width: 769px)" }, (context) => {
      const { isMobile } = context.conditions!;

      if (isMobile) {
        words.forEach((el, i) => {
          const badges = boxes[i].querySelectorAll(".hero__badge");
          const text = boxes[i].querySelector(".hero__box-text");
          gsap.set([el, subs[i]], { autoAlpha: 0, y: 20 });
          gsap.set(boxes[i], { autoAlpha: 1 });
          gsap.set(badges, { autoAlpha: 0, y: 12 });
          if (text) gsap.set(text, { autoAlpha: 0, y: 12 });

          const tl = gsap
            .timeline({ scrollTrigger: { trigger: el, start: "top 85%" } })
            .to(el, { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.6 })
            .to(subs[i], { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.6 }, "-=0.3")
            .to(badges, { autoAlpha: 1, y: 0, ease: "power2.out", duration: BADGE_DURATION, stagger: BADGE_STAGGER }, "-=0.2");

          if (text) {
            tl.to(text, { autoAlpha: 1, y: 0, ease: "power2.out", duration: TEXT_DURATION }, `-=${TEXT_OVERLAP}`);
          }
        });
        const onGotoMobile = (e: Event) => {
          const el = words[(e as CustomEvent<number>).detail];
          if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY - 100);
        };
        window.addEventListener("hero:goto", onGotoMobile);
        return () => {
          window.removeEventListener("hero:goto", onGotoMobile);
          ScrollTrigger.getAll().forEach((st) => st.kill());
        };
      }

      // --- 데스크탑 ---
      const center = { xPercent: -50, yPercent: -50, top: "50%", left: "50%" };
      words.forEach((el) => gsap.set(el, { autoAlpha: 0, ...center, x: 0, y: 0 }));
      gsap.set(subs, { autoAlpha: 0, y: 12 });
      gsap.set(boxes, { autoAlpha: 1 }); // 박스 자체는 배경 없는 래퍼라 즉시 표시, 내부 요소만 애니메이션
      boxes.forEach((box) => {
        gsap.set(box.querySelectorAll(".hero__badge"), { autoAlpha: 0, y: 12 });
        const text = box.querySelector(".hero__box-text");
        if (text) gsap.set(text, { autoAlpha: 0, y: 12 });
      });
      gsap.set(circle, { scale: 0 });

      const totalDuration = total * PAGE_DURATION + (total - 1) * TRANSITION_DURATION;

      // 사이드 내비게이션에 현재 위치 알림 (-1: 인트로 쪽, -2: 작업물 쪽, 0~3: 키워드)
      let activeIndex = -1;
      const emitActive = (i: number) => window.dispatchEvent(new CustomEvent<number>("hero:active", { detail: i }));

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${totalDuration * SCROLL_PER_SECOND}%`,
          scrub: 1,
          pin: true,
          onEnter: () => emitActive(Math.max(activeIndex, 0)),
          onEnterBack: () => emitActive(Math.max(activeIndex, 0)),
          onLeave: () => emitActive(-2),
          onLeaveBack: () => emitActive(-1),
        },
      });

      // 페이지 하나의 "등장" 시퀀스: 단어 이동 → 서브 → 배지 순차 등장 → 텍스트
      const enterPage = (i: number) => {
        const t = pageStart(i);
        const subStart = t + ENTER - OVERLAP;
        const badgeStart = subStart;
        const badges = boxes[i].querySelectorAll(".hero__badge");
        const text = boxes[i].querySelector(".hero__box-text");
        const textStart = badgeStart + badgesTotalDuration(badges) - TEXT_OVERLAP;

        tl.to(words[i], { left: "8vw", top: "40%", xPercent: 0, ease: "power2.out", duration: ENTER }, t).to(subs[i], { autoAlpha: 1, y: 0, ease: "power2.out", duration: ENTER }, subStart).to(badges, { autoAlpha: 1, y: 0, ease: "power2.out", duration: BADGE_DURATION, stagger: BADGE_STAGGER }, badgeStart);

        if (text) {
          tl.to(text, { autoAlpha: 1, y: 0, ease: "power2.out", duration: TEXT_DURATION }, textStart);
        }
      };

      tl.set(words[0], { autoAlpha: 1 }, 0);
      enterPage(0);

      const swapTimes: number[] = [];

      for (let i = 1; i < total; i++) {
        const coverStart = pageStart(i - 1) + PAGE_DURATION;
        const coverEnd = coverStart + COVER;
        swapTimes.push(coverEnd);
        const prevBadges = boxes[i - 1].querySelectorAll(".hero__badge");
        const prevText = boxes[i - 1].querySelector(".hero__box-text");

        tl.set(circle, { attr: { "data-page": i } }, coverStart)
          .to(circle, { scale: 1.8, ease: "power2.inOut", duration: COVER }, coverStart)
          // 원이 "완전히" 다 덮인 시점에만 콘텐츠 교체
          .set([words[i - 1], subs[i - 1]], { autoAlpha: 0 }, coverEnd)
          .set(subs[i - 1], { y: 12 }, coverEnd)
          .set(prevBadges, { autoAlpha: 0, y: 12 }, coverEnd)
          .set(words[i], { ...center, autoAlpha: 1 }, coverEnd)
          .to(circle, { scale: 0, ease: "power2.inOut", duration: REVEAL }, coverEnd);

        if (prevText) {
          tl.set(prevText, { autoAlpha: 0, y: 12 }, coverEnd);
        }

        enterPage(i); // coverEnd + REVEAL + PAUSE 시점에 자동으로 배치됨
      }

      // 멈춤 지점: 각 키워드 화면이 완성된 시점
      const settleTime = (i: number) => pageStart(i) + ENTER + DWELL * 0.5;
      HERO_PAGES.forEach((_, i) => tl.addLabel(`page${i}`, settleTime(i)));
      tl.to({}, { duration: 0 }, totalDuration); // 마지막 키워드도 머무는 시간 확보

      // 라벨(브레드크럼/HEX/스크롤유도) 동기화
      const updateLabels = (i: number) => {
        if (i === activeIndex) return;
        activeIndex = i;
        const p = HERO_PAGES[i];
        breadcrumbRef.current!.textContent = `> ${p.text.toUpperCase()}`;
        hexRef.current!.textContent = tokenValue(p.token);
        [breadcrumbRef, hexRef].forEach((ref) => (ref.current!.style.color = `var(${p.token})`));
        scrollCueRef.current!.style.setProperty("--cue-color", `var(${p.token})`);
        if (tl.scrollTrigger?.isActive) emitActive(i); // 구간 안에 있을 때만 사이드 내비 갱신
      };
      updateLabels(0);

      tl.eventCallback("onUpdate", () => {
        const t = tl.time();
        updateLabels(swapTimes.filter((s) => t >= s).length);
      });

      // 키워드 클릭 → 해당 역량 화면이 완성된 지점으로 이동
      const onGoto = (e: Event) => {
        const st = tl.scrollTrigger;
        if (!st) return;
        scrollToY(st.labelToScroll(`page${(e as CustomEvent<number>).detail}`));
      };
      window.addEventListener("hero:goto", onGoto);

      // 키워드 구간 안에서는 휠 한 번 / 키보드 한 번 = 키워드 하나씩 이동
      let locked = false;
      let cooldownUntil = 0;
      const stepTo = (dir: 1 | -1): boolean => {
        const st = tl.scrollTrigger;
        if (!st) return false;
        const y = window.scrollY;
        if (y < st.start - 5 || y > st.end + 5) return false; // 구간 밖은 일반 스크롤
        const stops = HERO_PAGES.map((_, i) => st.labelToScroll(`page${i}`));
        const target = dir > 0 ? stops.find((v) => v > y + 2) : [...stops].reverse().find((v) => v < y - 2);
        if (target === undefined) return false; // 첫/마지막 키워드에서 바깥으로 나갈 때는 일반 스크롤
        locked = true;
        scrollToY(target, {
          duration: 1.1,
          onComplete: () => {
            locked = false;
            cooldownUntil = performance.now() + 450; // 트랙패드 관성 스크롤 흡수
          },
        });
        return true;
      };
      const consume = (e: Event) => {
        e.preventDefault();
        e.stopImmediatePropagation();
      };
      const onWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaY) < 2) return;
        const st = tl.scrollTrigger;
        const y = window.scrollY;
        const inside = st && y >= st.start - 5 && y <= st.end + 5;
        if (inside && (locked || performance.now() < cooldownUntil)) return consume(e);
        if (stepTo(e.deltaY > 0 ? 1 : -1)) consume(e);
      };
      const onKey = (e: KeyboardEvent) => {
        const down = ["ArrowDown", "PageDown", " "].includes(e.key) && !e.shiftKey;
        const up = ["ArrowUp", "PageUp"].includes(e.key) || (e.key === " " && e.shiftKey);
        if (!down && !up) return;
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        if (locked) return consume(e);
        if (stepTo(down ? 1 : -1)) consume(e);
      };
      window.addEventListener("wheel", onWheel, { passive: false, capture: true });
      window.addEventListener("keydown", onKey, { capture: true });

      // 테마 전환 시 HEX 라벨만 갱신
      const onTheme = () => {
        if (activeIndex >= 0) hexRef.current!.textContent = tokenValue(HERO_PAGES[activeIndex].token);
      };
      window.addEventListener("themechange", onTheme);

      return () => {
        window.removeEventListener("hero:goto", onGoto);
        window.removeEventListener("wheel", onWheel, { capture: true });
        window.removeEventListener("keydown", onKey, { capture: true });
        window.removeEventListener("themechange", onTheme);
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="hero" ref={sectionRef}>
      <span className="hero__crop hero__crop--tl" />
      <span className="hero__crop hero__crop--tr" />
      <span className="hero__crop hero__crop--bl" />
      <span className="hero__crop hero__crop--br" />

      <div className="hero__label">
        <div className="hero__breadcrumb" ref={breadcrumbRef} />
        <div className="hero__hex" ref={hexRef} />
      </div>

      {/* Page 0 — Strategy */}
      <div className="hero__page">
        <span className="hero__word" ref={(el) => { if (el) wordRefs.current[0] = el; }} style={{ color: "var(--kw-strategy)" }}>
          Strategy
        </span>
        <div className="hero__sub" ref={(el) => { if (el) subRefs.current[0] = el; }}>
          Research, planning, and structuring the problem
        </div>
        <div className="hero__box" ref={(el) => { if (el) boxRefs.current[0] = el; }}>
          <div className="hero__box-badges">
            <span className="hero__badge hero__badge--strategy">Requirements</span>
            <span className="hero__badge hero__badge--strategy">IA</span>
            <span className="hero__badge hero__badge--strategy">User Flow</span>
            <span className="hero__badge hero__badge--strategy">Wireframe</span>
          </div>
          <p className="hero__box-text">
            이해관계자 요구 정리, 정보구조 설계, 사용자 흐름 정의.
            <br />
            막연한 문제를 실행 가능한 구조로 바꾸는 단계.
          </p>
        </div>
      </div>

      {/* Page 1 — Design */}
      <div className="hero__page">
        <span className="hero__word" ref={(el) => { if (el) wordRefs.current[1] = el; }} style={{ color: "var(--kw-design)" }}>
          Design
        </span>
        <div className="hero__sub" ref={(el) => { if (el) subRefs.current[1] = el; }}>
          UI/UX, visual systems, and interaction design
        </div>
        <div className="hero__box" ref={(el) => { if (el) boxRefs.current[1] = el; }}>
          {/* Design 배지 다음에 채울 예정 */}
        </div>
      </div>

      {/* Page 2 — Proposal */}
      <div className="hero__page">
        <span className="hero__word" ref={(el) => { if (el) wordRefs.current[2] = el; }} style={{ color: "var(--kw-proposal)" }}>
          Proposal
        </span>
        <div className="hero__sub" ref={(el) => { if (el) subRefs.current[2] = el; }}>
          Proposals, IR decks, and documents that persuade
        </div>
        <div className="hero__box" ref={(el) => { if (el) boxRefs.current[2] = el; }}>
          {/* Proposal 배지 다음에 채울 예정 */}
        </div>
      </div>

      {/* Page 3 — Lead */}
      <div className="hero__page">
        <span className="hero__word" ref={(el) => { if (el) wordRefs.current[3] = el; }} style={{ color: "var(--kw-lead)" }}>
          Lead
        </span>
        <div className="hero__sub" ref={(el) => { if (el) subRefs.current[3] = el; }}>
          Directing teams and owning outcomes
        </div>
        <div className="hero__box" ref={(el) => { if (el) boxRefs.current[3] = el; }}>
          {/* Lead 배지 다음에 채울 예정 */}
        </div>
      </div>

      <div className="hero__scroll-cue" ref={scrollCueRef}>
        <span>Scroll</span>
        <div className="hero__scroll-arrow" />
      </div>

      <div className="hero__circle" ref={circleRef} />
    </section>
  );
}

export default Hero;
