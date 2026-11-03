import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CHAPTERS, panelsOf, type Chapter as ChapterData } from "../../data/chapters";
import { scrollToY } from "../../lib/scroll";
import { registerStops } from "../../lib/steps";
import WorkPanel from "./WorkPanel";
import "./Chapter.css";

gsap.registerPlugin(ScrollTrigger);

type Props = { chapter: ChapterData; index: number };

// 테마별 실제 HEX 값을 CSS 변수에서 읽어옴
const tokenValue = (token: string) => getComputedStyle(document.documentElement).getPropertyValue(token).trim().toUpperCase();

export type ChapterActive = { chapter: number; panel: number };
const emitActive = (detail: ChapterActive) => window.dispatchEvent(new CustomEvent<ChapterActive>("chapter:active", { detail }));

function Chapter({ chapter, index }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const panels = useMemo(() => panelsOf(chapter), [chapter]);
  const [panel, setPanel] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hex, setHex] = useState("");
  const isLast = index === CHAPTERS.length - 1;

  // 테마가 바뀌면 HEX 라벨 갱신
  useEffect(() => {
    const update = () => setHex(tokenValue(chapter.token));
    update();
    window.addEventListener("themechange", update);
    return () => window.removeEventListener("themechange", update);
  }, [chapter.token]);

  useEffect(() => {
    const section = sectionRef.current!;
    const track = trackRef.current!;
    const cover = coverRef.current!;
    const q = gsap.utils.selector(cover);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mm = gsap.matchMedia();
    const count = panels.length;

    // 표지 등장: 단어가 가운데에서 왼쪽 위로 이동 → 설명·배지·텍스트 순서
    const coverIntro = () => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      tl.from(q(".cover__word"), { left: "50%", top: "50%", xPercent: -50, yPercent: -50, duration: 1 })
        .from(q(".cover__sub"), { autoAlpha: 0, y: 12, duration: 0.6 }, 0.55)
        .from(q(".cover__badge"), { autoAlpha: 0, y: 12, duration: 0.4, stagger: 0.08 }, 0.6)
        .from(q(".cover__desc"), { autoAlpha: 0, y: 12, duration: 0.5 }, 0.85);
      return tl;
    };

    mm.add("(min-width: 769px)", () => {
      let current = -1;
      const distance = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setProgress(self.progress);
            const i = Math.round(self.progress * (count - 1));
            if (i !== current) {
              current = i;
              setPanel(i);
              if (self.isActive) emitActive({ chapter: index, panel: i });
            }
          },
          onEnter: () => emitActive({ chapter: index, panel: Math.max(current, 0) }),
          onEnterBack: () => emitActive({ chapter: index, panel: Math.max(current, 0) }),
          onLeave: () => isLast && emitActive({ chapter: -2, panel: 0 }),
          onLeaveBack: () => index === 0 && emitActive({ chapter: -1, panel: 0 }),
        },
      });

      // 표지가 화면에 다 들어오면 등장 애니메이션 재생, 위로 벗어나면 초기화
      let intro: gsap.core.Timeline | null = null;
      if (!reduce) {
        intro = coverIntro();
        ScrollTrigger.create({
          trigger: section,
          start: "top 5%",
          onEnter: () => intro!.restart(),
          onLeaveBack: () => intro!.pause(0),
        });
      }

      const st = tween.scrollTrigger!;
      // 장 위치 (+1px: 구간 시작 경계에서 확실히 "안"으로 들어오도록)
      const scrollForPanel = (p: number) => st.start + 1 + (p / (count - 1)) * (st.end - st.start - 1);
      const unregister = registerStops(`chapter-${index}`, () => Array.from({ length: count }, (_, p) => scrollForPanel(p)));

      // 사이드 내비에서 이동 요청
      const onGoto = (e: Event) => {
        const d = (e as CustomEvent<ChapterActive>).detail;
        if (d.chapter !== index) return;
        scrollToY(scrollForPanel(d.panel), { duration: 1.2 });
      };
      window.addEventListener("chapter:goto", onGoto);

      return () => {
        unregister();
        window.removeEventListener("chapter:goto", onGoto);
      };
    });

    // 모바일: 가로 고정 없이 세로로 쌓음. 내비 이동은 해당 장 위치로
    mm.add("(max-width: 768px)", () => {
      const onGoto = (e: Event) => {
        const d = (e as CustomEvent<ChapterActive>).detail;
        if (d.chapter !== index) return;
        const el = track.children[d.panel] as HTMLElement | undefined;
        if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY);
      };
      window.addEventListener("chapter:goto", onGoto);
      return () => window.removeEventListener("chapter:goto", onGoto);
    });

    return () => mm.revert();
  }, [panels, index, isLast]);

  return (
    <section className="chapter" id={chapter.id} ref={sectionRef} data-chapter={index} style={{ "--kw": `var(${chapter.token})` } as React.CSSProperties}>
      <div className="chapter__label">
        <div className="chapter__crumb">&gt; {chapter.text.toUpperCase()}</div>
        <div className="chapter__hex">{hex}</div>
      </div>

      <div className="chapter__track" ref={trackRef}>
        <div className="chapter__panel cover" ref={coverRef}>
          <span className="cover__word">{chapter.text}</span>
          <p className="cover__sub">{chapter.sub}</p>
          <div className="cover__box">
            <div className="cover__badges">
              {chapter.badges.map((b) => (
                <span className="cover__badge" key={b}>
                  {b}
                </span>
              ))}
            </div>
            <p className="cover__desc">{chapter.desc}</p>
          </div>
        </div>

        {panels.slice(1).map((p, i) =>
          p.kind === "cover" ? null : <WorkPanel key={`${p.work.id}-${p.kind}`} work={p.work} workIndex={p.index} detail={p.kind === "detail"} panelNo={i + 2} />
        )}
      </div>

      <div className="chapter__progress" aria-hidden="true">
        <span className="chapter__count">
          {String(panel + 1).padStart(2, "0")} / {String(panels.length).padStart(2, "0")}
        </span>
        <span className="chapter__bar">
          <span className="chapter__bar-fill" style={{ transform: `scaleX(${progress})` }} />
        </span>
      </div>
    </section>
  );
}

export default Chapter;
