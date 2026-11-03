import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CHAPTERS } from "../../data/chapters";
import "./Intro.css";

gsap.registerPlugin(ScrollTrigger);

const NAME = "Kim Jieun";

function Intro() {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    const q = gsap.utils.selector(section);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (!reduce) {
        // 첫 진입: 위에서 아래 순서로 살짝씩 등장
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(q(".intro__label"), { autoAlpha: 0, y: 12, duration: 0.6 }, 0.1)
          .from(q(".intro__char"), { autoAlpha: 0, yPercent: 60, duration: 0.7, stagger: 0.04 }, 0.2)
          .from(q(".intro__name-kr"), { autoAlpha: 0, x: -8, duration: 0.6 }, 0.7)
          .from(q(".intro__title"), { autoAlpha: 0, y: 20, duration: 0.7 }, 0.75)
          .from(q(".intro__desc"), { autoAlpha: 0, y: 12, duration: 0.6 }, 0.9)
          .from(q(".intro__scroll"), { autoAlpha: 0, duration: 0.6 }, 1.3);
      }

      // 스크롤 시 내용이 살짝 위로 밀리며 흐려짐
      gsap.to(innerRef.current, {
        y: -60,
        autoAlpha: 0.15,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const goTo = (i: number) => window.dispatchEvent(new CustomEvent("chapter:goto", { detail: { chapter: i, panel: 0 } }));

  return (
    <section className="intro" ref={sectionRef}>
      <span className="intro__crop intro__crop--tl" />
      <span className="intro__crop intro__crop--tr" />
      <span className="intro__crop intro__crop--bl" />
      <span className="intro__crop intro__crop--br" />

      <div className="intro__top">Portfolio 2026</div>

      <div className="intro__inner" ref={innerRef}>
        <div className="intro__main">
          <p className="intro__label">UI/UX · Proposal Designer · Since 2019</p>
          <h1 className="intro__name">
            <span className="intro__name-en" aria-label={NAME}>
              {NAME.split("").map((c, i) => (
                <span className="intro__char" key={i} aria-hidden="true">
                  {c === " " ? " " : c}
                </span>
              ))}
            </span>
            <span className="intro__name-kr">김지은</span>
          </h1>
          <p className="intro__title">기획하고, 디자인하고, 설득합니다.</p>
          <p className="intro__desc">복잡한 이야기를 한 장으로 정리합니다.</p>
        </div>

        <nav className="intro__keywords" aria-label="역량 바로가기 (모바일)">
          {CHAPTERS.map((p, i) => (
            <button type="button" className="intro__keyword" key={p.text} style={{ color: `var(${p.token})` }} onClick={() => goTo(i)}>
              <span className="intro__keyword-text">{p.text}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="intro__scroll">
        <span>Scroll</span>
        <div className="intro__scroll-line" />
      </div>
    </section>
  );
}

export default Intro;
