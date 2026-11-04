import { useState } from "react";
import type { Pin } from "../../data/chapters";
import "./Media.css";

type Props = { pins: Pin[] };

// 화면설계서의 번호 핀처럼, 이미지 위 지점에 메모를 붙임
function Pins({ pins }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <ol className="pins" aria-label="화면 주석">
      {pins.map((p, i) => (
        <li
          key={i}
          className={`pin${open === i ? " is-open" : ""}${p.x > 60 ? " pin--left" : ""}`}
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          onMouseEnter={() => setOpen(i)}
          onMouseLeave={() => setOpen((v) => (v === i ? null : v))}
        >
          <button type="button" className="pin__dot" aria-expanded={open === i} onFocus={() => setOpen(i)} onBlur={() => setOpen(null)} onClick={() => setOpen((v) => (v === i ? null : i))}>
            {i + 1}
          </button>
          <span className="pin__note" role="note">
            {p.text}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default Pins;
