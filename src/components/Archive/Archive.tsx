import { useRef, useState } from "react";
import gsap from "gsap";
import { ARCHIVE } from "../../data/archive";
import "./Archive.css";

// 이전 작업 목록 — 줄에 마우스를 올리면 화면 캡처가 커서를 따라 뜸
function Archive() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const item = active !== null ? ARCHIVE[active] : null;

  const move = (e: React.PointerEvent) => {
    const el = previewRef.current;
    if (!el) return;
    gsap.to(el, { x: e.clientX, y: e.clientY, duration: 0.45, ease: "power3.out" });
  };

  const enter = (i: number, e: React.PointerEvent) => {
    const el = previewRef.current;
    if (el && active === null) gsap.set(el, { x: e.clientX, y: e.clientY });
    setActive(i);
  };

  return (
    <section className="archive" id="archive" data-stop onPointerMove={move}>
      <header className="archive__head">
        <p className="archive__label">Archive</p>
        <h2 className="archive__title">2019 — 2025</h2>
        <p className="archive__desc">2019년부터 이어 온 웹·모바일 디자인과 퍼블리싱 작업입니다.<br />홈페이지, 예약 서비스, QR 출입, 앱까지 여러 분야의 화면을 만들었습니다.</p>
      </header>

      <ul className="archive__list" onPointerLeave={() => setActive(null)}>
        {ARCHIVE.map((a, i) => (
          <li
            key={a.title}
            className={`archive__row${active === i ? " is-active" : ""}${a.thumb ? " has-thumb" : ""}`}
            onPointerEnter={(e) => enter(i, e)}
          >
            <span className="archive__year">{a.year}</span>
            <span className="archive__name">
              {a.title}
              {a.client && <em>{a.client}</em>}
            </span>
            <span className="archive__type">{a.type}</span>
            <span className="archive__role">
              {a.role.map((r) => (
                <i key={r}>{r}</i>
              ))}
            </span>
          </li>
        ))}
      </ul>

      <div ref={previewRef} className={`archive__preview${item?.thumb ? " is-on" : ""}`} aria-hidden="true">
        {ARCHIVE.filter((a) => a.thumb).map((a) => (
          <img
            key={a.thumb}
            className={`archive__shot archive__shot--${a.device}${item?.thumb === a.thumb ? " is-current" : ""}`}
            src={`/works/archive/${a.thumb}.webp`}
            alt=""
            loading="lazy"
          />
        ))}
      </div>
    </section>
  );
}

export default Archive;
