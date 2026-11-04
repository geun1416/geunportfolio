import { useEffect, useRef, useState } from "react";
import Compare from "../Media/Compare";
import "./Rearrange.css";

// 개편 전 화면의 블록이 이름표를 단 채 개편 후 위치로 옮겨 가는 애니메이션
export type Rect = [number, number, number, number]; // x, y, w, h (%)
export type Block = { label: string; from?: Rect; to?: Rect; toLabel?: string };
type Props = { before: string; after: string; blocks: Block[]; alt: string; onDone?: (done: boolean) => void };

// 0 개편 전 · 1 구역 표시 · 2 덜어낼 것 · 3 재배치 · 4 개편 후
const TIMES = [700, 1500, 1300, 1700];

const box = (r?: Rect) => (r ? { left: `${r[0]}%`, top: `${r[1]}%`, width: `${r[2]}%`, height: `${r[3]}%` } : undefined);

function Rearrange({ before, after, blocks, alt, onDone }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<"anim" | "compare">("anim");
  const [run, setRun] = useState(0);
  const timers = useRef<number[]>([]);

  const play = () => {
    timers.current.forEach(clearTimeout);
    setStep(0);
    let t = 0;
    timers.current = TIMES.map((d, i) => ((t += d), window.setTimeout(() => setStep(i + 1), t)));
  };

  // 화면에 보일 때 한 번 재생
  useEffect(() => {
    const el = ref.current;
    if (!el || mode !== "anim") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return setStep(4);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio > 0.6) {
          play();
          io.disconnect();
        }
      },
      { threshold: [0, 0.6, 1] }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.current.forEach(clearTimeout);
    };
  }, [mode, run]);

  useEffect(() => onDone?.(mode === "compare" || step >= 4), [step, mode, onDone]);

  if (mode === "compare") {
    return (
      <div className="rearrange" ref={ref}>
        <Compare before={before} after={after} alt={alt} />
        <div className="rearrange__bar">
          <button type="button" onClick={() => (setMode("anim"), setRun((r) => r + 1))}>
            ▶ 재배치 보기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`rearrange is-step-${step}`} ref={ref}>
      <img className="rearrange__img rearrange__img--before" src={before} alt={`${alt} 개편 전`} draggable={false} />
      <img className="rearrange__img rearrange__img--after" src={after} alt={`${alt} 개편 후`} draggable={false} />
      {blocks.map((b) => {
        const removed = !b.to;
        const added = !b.from;
        const rect = step >= 3 ? b.to ?? b.from : b.from ?? b.to;
        return (
          <div
            key={b.label}
            className={`rearrange__block${removed ? " is-removed" : ""}${added ? " is-added" : ""}`}
            style={box(rect)}
          >
            <span>{step >= 3 && b.toLabel ? b.toLabel : b.label}</span>
          </div>
        );
      })}
      <p className="rearrange__caption" aria-live="polite">
        {["개편 전", "화면을 구역으로 나누고", "조종자에게 필요 없는 것은 덜어내고", "필요한 정보는 다시 배치", "개편 후"][step]}
      </p>
      <div className="rearrange__bar">
        <button type="button" onClick={play}>
          ↻ 다시 보기
        </button>
        <button type="button" onClick={() => setMode("compare")}>
          ⇆ 전후 비교
        </button>
      </div>
    </div>
  );
}

export default Rearrange;
