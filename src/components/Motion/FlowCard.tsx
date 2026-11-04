import { useEffect, useState } from "react";
import "./FlowCard.css";

// 첫 화면 카드: 화면설계서 → 디자인 시안 → 제안서로 같은 블록이 모양을 바꿔 가며 이어짐
type S = { l: number; t: number; w: number; h: number; bg: string; r?: number; o?: number; dash?: boolean };

const INK = "#26263F";
const STAGES: { label: string; els: S[] }[] = [
  {
    label: "화면설계서",
    els: [
      { l: 5, t: 6, w: 90, h: 9, bg: "#ECE8E1", r: 2 },
      { l: 5, t: 21, w: 55, h: 44, bg: "#F6F4F0", r: 2, dash: true },
      { l: 64, t: 21, w: 31, h: 20, bg: "#F6F4F0", r: 2, dash: true },
      { l: 64, t: 45, w: 31, h: 20, bg: "#F6F4F0", r: 2, dash: true },
      { l: 5, t: 70, w: 90, h: 13, bg: "#F6F4F0", r: 2, dash: true },
      { l: 72, t: 87, w: 23, h: 7, bg: "#D9D4CB", r: 2 },
      { l: 30, t: 40, w: 0, h: 5, bg: INK, o: 0 },
      { l: 30, t: 50, w: 0, h: 5, bg: INK, o: 0 },
    ],
  },
  {
    label: "디자인 시안",
    els: [
      { l: 5, t: 6, w: 90, h: 9, bg: INK, r: 6 },
      { l: 5, t: 21, w: 55, h: 44, bg: "#F6D7D3", r: 8 },
      { l: 64, t: 21, w: 31, h: 20, bg: "#E0B062", r: 8 },
      { l: 64, t: 45, w: 31, h: 20, bg: "#FCEEDC", r: 8 },
      { l: 5, t: 70, w: 90, h: 13, bg: "#F1EEE8", r: 8 },
      { l: 72, t: 87, w: 23, h: 7, bg: "#B24A30", r: 20 },
      { l: 30, t: 40, w: 0, h: 5, bg: INK, o: 0 },
      { l: 30, t: 50, w: 0, h: 5, bg: INK, o: 0 },
    ],
  },
  {
    label: "제안서",
    els: [
      { l: 0, t: 0, w: 100, h: 5, bg: "#4F7344", r: 0 },
      { l: 48, t: 14, w: 46, h: 66, bg: "#9DBB8F", r: 4 },
      { l: 7, t: 18, w: 18, h: 4, bg: "#4F7344", r: 2 },
      { l: 7, t: 58, w: 30, h: 3, bg: "#BDB7AC", r: 2 },
      { l: 0, t: 88, w: 100, h: 12, bg: "#4F7344", r: 0 },
      { l: 7, t: 77, w: 12, h: 4, bg: INK, r: 2 },
      { l: 7, t: 28, w: 36, h: 9, bg: INK, r: 2, o: 1 },
      { l: 7, t: 41, w: 26, h: 9, bg: INK, r: 2, o: 1 },
    ],
  },
];
// 화면설계서 단계의 번호 표시
const BADGES = [
  [3, 18],
  [62, 18],
  [3, 67],
];

type Props = { onStep?: (i: number) => void };

function FlowCard({ onStep }: Props) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % STAGES.length), 2600);
    return () => window.clearInterval(id);
  }, []);
  useEffect(() => onStep?.(i), [i, onStep]);

  const st = STAGES[i];
  return (
    <figure className="flowcard" aria-hidden="true">
      <div className="flowcard__paper">
        {st.els.map((e, k) => (
          <span
            key={k}
            className={`flowcard__el${e.dash ? " is-dash" : ""}`}
            style={{ left: `${e.l}%`, top: `${e.t}%`, width: `${e.w}%`, height: `${e.h}%`, background: e.bg, borderRadius: e.r ?? 2, opacity: e.o ?? 1 }}
          />
        ))}
        {BADGES.map(([l, t], k) => (
          <span key={`b${k}`} className={`flowcard__badge${i === 0 ? " is-on" : ""}`} style={{ left: `${l}%`, top: `${t}%`, transitionDelay: `${k * 0.08}s` }}>
            {k + 1}
          </span>
        ))}
      </div>
      <figcaption className="flowcard__cap">
        {STAGES.map((s, k) => (
          <span key={s.label} className={`flowcard__step flowcard__step--${k}${k === i ? " is-on" : ""}`}>
            <b>{String(k + 1).padStart(2, "0")}</b>
            {s.label}
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

export default FlowCard;
