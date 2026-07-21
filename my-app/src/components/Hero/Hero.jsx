import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Hero.css";

gsap.registerPlugin(ScrollTrigger);

const PAGES = [
  { text: "Strategy", sub: "Research, planning, and structuring the problem", color: "#FF8B6B", box: <p className="hero__box-text">Placeholder content for Strategy</p> },
  { text: "Design", sub: "UI/UX, visual systems, and interaction design", color: "#FFB56B", box: <p className="hero__box-text">Placeholder content for Design</p> },
  { text: "Publish", sub: "From Figma to production-ready front-end", color: "#FF6B8F", box: <p className="hero__box-text">Placeholder content for Publish</p> },
  { text: "Lead", sub: "Directing teams and owning outcomes", color: "#B36BFF", box: <p className="hero__box-text">Placeholder content for Lead</p> },
];

// 시간 예산 (초 단위)
const ENTER = 1; // 단어 중앙 → 왼쪽위 이동
const OVERLAP = 0.6; // 서브/박스가 겹쳐서 시작하는 정도
const DWELL = 1.4; // 완성 후 멈춤
const COVER = 1.2; // 원 확장
const REVEAL = 1.2; // 원 축소
const PAUSE = 0.8; // 걷힌 후 중앙 멈춤

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

    mm.add({ isMobile: "(max-width: 768px)", isDesktop: "(min-width: 769px)" }, (context) => {
      const { isMobile } = context.conditions;

      if (isMobile) {
        words.forEach((el, i) => {
          gsap.set([el, subs[i], boxes[i]], { autoAlpha: 0, y: 20 });
          gsap
            .timeline({ scrollTrigger: { trigger: el, start: "top 85%" } })
            .to(el, { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.6 })
            .to(subs[i], { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.6 }, "-=0.3")
            .to(boxes[i], { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.6 }, "-=0.3");
        });
        return () => ScrollTrigger.getAll().forEach((st) => st.kill());
      }

      // --- 데스크탑 ---
      const center = { xPercent: -50, yPercent: -50, top: "50%", left: "50%" };
      words.forEach((el) => gsap.set(el, { autoAlpha: 0, ...center, x: 0, y: 0 }));
      gsap.set(subs, { autoAlpha: 0, y: 12 });
      gsap.set(boxes, { autoAlpha: 0, y: 12 });
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

      // 페이지 하나의 "등장" 시퀀스: 왼쪽위 이동 + 서브/박스 겹쳐서 등장
      const enterPage = (i) => {
        const t = pageStart(i);
        tl.to(words[i], { left: "8vw", top: "40%", xPercent: 0, ease: "power2.out", duration: ENTER }, t)
          .to(subs[i], { autoAlpha: 1, y: 0, ease: "power2.out", duration: ENTER }, t + ENTER - OVERLAP)
          .to(boxes[i], { autoAlpha: 1, y: 0, ease: "power2.out", duration: ENTER }, t + ENTER - OVERLAP);
      };

      tl.set(words[0], { autoAlpha: 1 }, 0);
      enterPage(0);

      const swapTimes = [];

      for (let i = 1; i < total; i++) {
        const coverStart = pageStart(i - 1) + PAGE_DURATION;
        const coverEnd = coverStart + COVER;
        swapTimes.push(coverEnd);

        tl.to(circle, { scale: 1.8, backgroundColor: PAGES[i].color, ease: "power2.inOut", duration: COVER }, coverStart)
          // 원이 "완전히" 다 덮인 시점에만 콘텐츠 교체
          .set([words[i - 1], subs[i - 1], boxes[i - 1]], { autoAlpha: 0 }, coverEnd)
          .set([subs[i - 1], boxes[i - 1]], { y: 12 }, coverEnd)
          .set(words[i], { ...center, autoAlpha: 1 }, coverEnd)
          .to(circle, { scale: 0, ease: "power2.inOut", duration: REVEAL }, coverEnd);

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

      {PAGES.map((page, i) => (
        <div className="hero__page" key={page.text}>
          <span className="hero__word" ref={(el) => (wordRefs.current[i] = el)} style={{ color: page.color }}>
            {page.text}
          </span>
          <div className="hero__sub" ref={(el) => (subRefs.current[i] = el)}>
            {page.sub}
          </div>
          <div className="hero__box" ref={(el) => (boxRefs.current[i] = el)}>
            {page.box}
          </div>
        </div>
      ))}

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
