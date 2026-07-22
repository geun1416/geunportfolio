import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Hero.css";

gsap.registerPlugin(ScrollTrigger);

const PAGES = [
  { text: "Strategy", sub: "Research, planning, and structuring the problem", color: "#FF8B6B" },
  { text: "Design", sub: "UI/UX, visual systems, and interaction design", color: "#FFB56B" },
  { text: "Publish", sub: "From Figma to production-ready front-end", color: "#FF6B8F" },
  { text: "Lead", sub: "Directing teams and owning outcomes", color: "#B36BFF" },
];

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
const pageStart = (i) => i * (PAGE_DURATION + TRANSITION_DURATION);

function Hero() {
  const sectionRef = useRef(null);
  const circleRef = useRef(null);
  const breadcrumbRef = useRef(null);
  const hexRef = useRef(null);
  const counterRef = useRef(null);
  const scrollCueRef = useRef(null);
  const wordRefs = useRef([]);
  const subRefs = useRef([]);
  const boxRefs = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const circle = circleRef.current;
    const words = wordRefs.current;
    const subs = subRefs.current;
    const boxes = boxRefs.current;
    const total = PAGES.length;
    const mm = gsap.matchMedia();

    // 배지들 stagger 등장에 걸리는 총 시간 계산
    const badgesTotalDuration = (badges) => (badges.length ? BADGE_DURATION + (badges.length - 1) * BADGE_STAGGER : 0);

    mm.add({ isMobile: "(max-width: 768px)", isDesktop: "(min-width: 769px)" }, (context) => {
      const { isMobile } = context.conditions;

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
        return () => ScrollTrigger.getAll().forEach((st) => st.kill());
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
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${totalDuration * 120}%`,
          scrub: 1,
          pin: true,
        },
      });

      // 페이지 하나의 "등장" 시퀀스: 단어 이동 → 서브 → 배지 순차 등장 → 텍스트
      const enterPage = (i) => {
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

      const swapTimes = [];

      for (let i = 1; i < total; i++) {
        const coverStart = pageStart(i - 1) + PAGE_DURATION;
        const coverEnd = coverStart + COVER;
        swapTimes.push(coverEnd);
        const prevBadges = boxes[i - 1].querySelectorAll(".hero__badge");
        const prevText = boxes[i - 1].querySelector(".hero__box-text");

        tl.to(circle, { scale: 1.8, backgroundColor: PAGES[i].color, ease: "power2.inOut", duration: COVER }, coverStart)
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

      // 라벨(브레드크럼/HEX/카운터/스크롤유도) 동기화
      let activeIndex = -1;
      const updateLabels = (i) => {
        if (i === activeIndex) return;
        activeIndex = i;
        const p = PAGES[i];
        breadcrumbRef.current.textContent = `> ${p.text.toUpperCase()}`;
        hexRef.current.textContent = p.color;
        counterRef.current.textContent = `${String(i + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
        [breadcrumbRef, hexRef, counterRef].forEach((ref) => (ref.current.style.color = p.color));
        scrollCueRef.current.style.setProperty("--cue-color", p.color);
      };
      updateLabels(0);

      tl.eventCallback("onUpdate", () => {
        const t = tl.time();
        updateLabels(swapTimes.filter((s) => t >= s).length);
      });

      return () => {
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
        <span className="hero__word" ref={(el) => (wordRefs.current[0] = el)} style={{ color: "#FF8B6B" }}>
          Strategy
        </span>
        <div className="hero__sub" ref={(el) => (subRefs.current[0] = el)}>
          Research, planning, and structuring the problem
        </div>
        <div className="hero__box" ref={(el) => (boxRefs.current[0] = el)}>
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
        <span className="hero__word" ref={(el) => (wordRefs.current[1] = el)} style={{ color: "#FFB56B" }}>
          Design
        </span>
        <div className="hero__sub" ref={(el) => (subRefs.current[1] = el)}>
          UI/UX, visual systems, and interaction design
        </div>
        <div className="hero__box" ref={(el) => (boxRefs.current[1] = el)}>
          {/* Design 배지 다음에 채울 예정 */}
        </div>
      </div>

      {/* Page 2 — Publish */}
      <div className="hero__page">
        <span className="hero__word" ref={(el) => (wordRefs.current[2] = el)} style={{ color: "#FF6B8F" }}>
          Publish
        </span>
        <div className="hero__sub" ref={(el) => (subRefs.current[2] = el)}>
          From Figma to production-ready front-end
        </div>
        <div className="hero__box" ref={(el) => (boxRefs.current[2] = el)}>
          {/* Publish 배지 다음에 채울 예정 */}
        </div>
      </div>

      {/* Page 3 — Lead */}
      <div className="hero__page">
        <span className="hero__word" ref={(el) => (wordRefs.current[3] = el)} style={{ color: "#B36BFF" }}>
          Lead
        </span>
        <div className="hero__sub" ref={(el) => (subRefs.current[3] = el)}>
          Directing teams and owning outcomes
        </div>
        <div className="hero__box" ref={(el) => (boxRefs.current[3] = el)}>
          {/* Lead 배지 다음에 채울 예정 */}
        </div>
      </div>

      <div className="hero__counter" ref={counterRef} />

      <div className="hero__scroll-cue" ref={scrollCueRef}>
        <span>Scroll</span>
        <div className="hero__scroll-arrow" />
      </div>

      <div className="hero__circle" ref={circleRef} />
    </section>
  );
}

export default Hero;
