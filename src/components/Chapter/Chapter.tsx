import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CHAPTERS, fullTitle, panelsOf, workPanelIndex, type Chapter as ChapterData } from "../../data/chapters";
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
  const innerRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const panels = useMemo(() => panelsOf(chapter), [chapter]);
  const [panel, setPanel] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hex, setHex] = useState("");
  const isLast = index === CHAPTERS.length - 1;

  // 진행 표시: 표지는 INDEX, 작업물은 목차 번호와 같은 기준으로 "01 / 04"
  const current = panels[panel];
  const pad = (n: number) => String(n).padStart(2, "0");
  const countLabel = !current || current.kind === "cover" ? "INDEX" : `${pad(current.index + 1)} / ${pad(chapter.works.length)}`;
  const goWork = (wi: number) =>
    window.dispatchEvent(new CustomEvent<ChapterActive>("chapter:goto", { detail: { chapter: index, panel: workPanelIndex(chapter, wi) } }));

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
    const inner = innerRef.current!;
    const shade = shadeRef.current!;
    const q = gsap.utils.selector(cover);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mm = gsap.matchMedia();
    const count = panels.length;

    // 표지 등장: 단어가 가운데에서 왼쪽 위로 이동 → 설명·배지·텍스트 순서
    const coverIntro = () => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      tl.from(q(".cover__word"), { left: "50%", top: "50%", xPercent: -50, yPercent: -50, duration: 1 })
        .from(q(".cover__aside"), { autoAlpha: 0, y: 12, duration: 0.6 }, 0.6)
        .from(q(".cover__index-head"), { autoAlpha: 0, duration: 0.5 }, 0.7)
        .from(q(".cover__row"), { autoAlpha: 0, y: 16, duration: 0.5, stagger: 0.07 }, 0.75);
      return tl;
    };

    mm.add("(min-width: 769px)", () => {
      let current = -1;
      const distance = () => track.scrollWidth - window.innerWidth;

      // 가로 스크롤(D) → 제자리 유지(100vh) 동안 다음 챕터가 아래에서 올라와 덮음
      const hold = () => window.innerHeight;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance() + hold()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // 가로 구간 기준 진행률 (유지 구간은 1로 고정)
            const hp = Math.min(1, Math.max(0, (self.scroll() - self.start) / distance()));
            setProgress(hp);
            const i = Math.round(hp * (count - 1));
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
      // 시간 단위 = 스크롤 px 비율 (가로 D : 유지 100vh)
      tl.to(track, { x: () => -distance(), ease: "none", duration: () => distance() })
        .to(inner, { scale: 0.92, ease: "none", duration: () => hold() })
        .to(shade, { opacity: 0.55, ease: "none", duration: () => hold() }, "<");

      // 이 챕터가 아래에서 올라오는 동안 위쪽 모서리가 둥글었다가 펴짐
      if (index > 0) {
        gsap.fromTo(
          section,
          { borderTopLeftRadius: 28, borderTopRightRadius: 28 },
          { borderTopLeftRadius: 0, borderTopRightRadius: 0, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "top top", scrub: true } }
        );
      }

      // 표지가 화면에 다 들어오면 등장 애니메이션 재생, 위로 벗어나면 초기화
      let intro: gsap.core.Timeline | null = null;
      if (!reduce) {
        intro = coverIntro();
        ScrollTrigger.create({
          trigger: section,
          start: "top 60%", // 카드가 올라오는 도중에 내용이 자리를 잡도록
          onEnter: () => intro!.restart(),
          onLeaveBack: () => intro!.pause(0),
        });
      }

      const st = tl.scrollTrigger!;
      // 장 위치 (+1px: 구간 시작 경계에서 확실히 "안"으로 들어오도록). 유지 구간은 제외
      const scrollForPanel = (p: number) => st.start + 1 + (p / (count - 1)) * (distance() - 1);
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
    <section
      className={`chapter${index > 0 ? " chapter--follow" : ""}`}
      id={chapter.id}
      ref={sectionRef}
      data-chapter={index}
      style={{ "--kw": `var(${chapter.token})`, zIndex: index + 1 } as React.CSSProperties}
    >
      <div className="chapter__inner" ref={innerRef}>
      <div className="chapter__label">
        <div className="chapter__crumb">&gt; {chapter.text.toUpperCase()}</div>
        <div className="chapter__hex">{hex}</div>
      </div>

      <div className="chapter__track" ref={trackRef}>
        <div className="chapter__panel cover" ref={coverRef}>
          <span className="cover__word">{chapter.text}</span>
          <div className="cover__aside">
            <p className="cover__desc">{chapter.desc}</p>
            <div className="cover__badges">
              {chapter.badges.map((b) => (
                <span className="cover__badge" key={b}>
                  {b}
                </span>
              ))}
            </div>
          </div>

          <nav className="cover__index" aria-label={`${chapter.text} 작업물 목차`}>
            <div className="cover__index-head">
              <span>In this chapter</span>
              <span>{pad(chapter.works.length)} works</span>
            </div>
            <ol className="cover__rows">
              {chapter.works.map((w, wi) => (
                <li key={w.id}>
                  <button type="button" className="cover__row" onClick={() => goWork(wi)}>
                    <span className="cover__row-no">{pad(wi + 1)}</span>
                    <span className="cover__row-title">{fullTitle(w)}</span>
                    <span className="cover__row-role">{w.role}</span>
                    <span className="cover__row-year">{w.period.split(" ")[0]}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {panels.slice(1).map((p, i) =>
          p.kind === "cover" ? null : <WorkPanel key={`${p.work.id}-${p.kind}-${p.kind === "detail" ? p.page : 0}`} work={p.work} workIndex={p.index} detail={p.kind === "detail"} page={p.kind === "detail" ? p.page : 0} panelNo={i + 2} />
        )}
      </div>

      <div className="chapter__progress" aria-hidden="true">
        <span className="chapter__count">{countLabel}</span>
        <span className="chapter__bar">
          <span className="chapter__bar-fill" style={{ transform: `scaleX(${progress})` }} />
        </span>
      </div>
      </div>
      <div className="chapter__shade" ref={shadeRef} aria-hidden="true" />
    </section>
  );
}

export default Chapter;
