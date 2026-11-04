import { useState } from "react";
import { HAEMILEUM_TOKENS, SECTORS } from "../../data/haemileumTokens";
import "./TokenPlayground.css";

// 해밀이음 디자인 토큰을 직접 바꿔 보는 작은 화면. 값은 Figma Variables에서 내보낸 JSON 그대로
type Mode = "light" | "dark";
type Sector = (typeof SECTORS)[number]["id"];

function TokenPlayground() {
  const [mode, setMode] = useState<Mode>("light");
  const [sector, setSector] = useState<Sector>("hae");
  const t = HAEMILEUM_TOKENS[mode];
  const v = (k: string) => t[k]?.hex;
  const a = (k: string) => t[`action/${sector}/${k}`];

  const vars = {
    "--t-page": v("bg/page"),
    "--t-surface": v("bg/surface"),
    "--t-text": v("text/primary"),
    "--t-sub": v("text/secondary"),
    "--t-border": v("border/default"),
    "--t-bg": a("bg").hex,
    "--t-tint": a("tint").hex,
    "--t-tborder": a("border").hex,
    "--t-ttext": a("text").hex,
    "--t-on": a("on-bg").hex,
  } as React.CSSProperties;

  const rows: [string, { ref: string; hex: string }][] = [
    ["bg/page", t["bg/page"]],
    ["text/primary", t["text/primary"]],
    [`action/${sector}/bg`, a("bg")],
    [`action/${sector}/tint`, a("tint")],
    [`action/${sector}/border`, a("border")],
  ];

  return (
    <div className="tokens" style={vars} onClick={(e) => e.stopPropagation()}>
      <div className="tokens__ui" aria-label="토큰이 적용된 학습 화면 예시">
        <div className="tokens__tabs">
          {["범위 선택", "한 문장씩", "주요 낱말", "퀴즈", "리포트"].map((x, i) => (
            <span key={x} className={i === 2 ? "is-on" : ""}>
              {x}
            </span>
          ))}
        </div>
        <div className="tokens__card">
          <p className="tokens__eyebrow">2부 · 자전거 여행</p>
          <p className="tokens__title">이야기 속 낱말을 알아봐요</p>
          <div className="tokens__chips">
            {["골짝", "갈림길", "오솔길"].map((x, i) => (
              <span key={x} className={i === 0 ? "is-on" : ""}>
                {x}
              </span>
            ))}
          </div>
          <p className="tokens__body">산과 산 사이에 깊고 길게 들어간 곳을 줄여 부르는 말이에요.</p>
          <div className="tokens__foot">
            <span className="tokens__ghost">이전</span>
            <span className="tokens__btn">다음 낱말 →</span>
          </div>
        </div>
      </div>

      <div className="tokens__panel">
        <p className="tokens__label">Mode</p>
        <div className="tokens__seg" role="group" aria-label="모드">
          {(["light", "dark"] as Mode[]).map((m) => (
            <button key={m} type="button" className={mode === m ? "is-on" : ""} onClick={() => setMode(m)}>
              {m === "light" ? "Light" : "Dark"}
            </button>
          ))}
        </div>
        <p className="tokens__label">Sector</p>
        <div className="tokens__sectors" role="group" aria-label="영역 색">
          {SECTORS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={sector === s.id ? "is-on" : ""}
              style={{ "--c": HAEMILEUM_TOKENS.light[`action/${s.id}/bg`].hex } as React.CSSProperties}
              onClick={() => setSector(s.id)}
            >
              {s.name}
            </button>
          ))}
        </div>
        <ul className="tokens__list">
          {rows.map(([name, val]) => (
            <li key={name}>
              <i style={{ background: val.hex }} />
              <span className="tokens__name">{name}</span>
              <span className="tokens__ref">{val.ref.startsWith("#") ? val.hex : val.ref}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TokenPlayground;
