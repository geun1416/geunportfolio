import { CHAPTERS } from "../../data/chapters";
import "./About.css";

import { FACTS, PILLARS, TOOLS } from "../../data/profile";

// 첫 화면 다음, 30초 안에 훑어볼 수 있는 요약
function About() {
  const goTo = (i: number) => window.dispatchEvent(new CustomEvent("chapter:goto", { detail: { chapter: i, panel: 0 } }));

  return (
    <section className="about" id="about" data-stop aria-label="한눈에 보기">
      <div className="about__head">
        <p className="about__label">About</p>
        <h2 className="about__title">
          웹 화면부터 인쇄물, 제안서까지
          <br />
          보이는 것은 모두 디자인합니다.
        </h2>
        <p className="about__desc">
          웹 디자인과 퍼블리싱으로 시작해 화면 기획과 제안서 디자인까지 맡아 왔습니다.
          <br />
          복잡한 내용을 정리해 한눈에 보이는 화면과 문서로 만드는 일을 합니다.
        </p>
      </div>

      <ul className="about__facts">
        {FACTS.map((f) => (
          <li key={f.value}>
            <strong>{f.value}</strong>
            <span>{f.label}</span>
          </li>
        ))}
      </ul>

      <div className="about__pillars">
        {PILLARS.map((p) => (
          <button
            type="button"
            key={p.word}
            className="about__pillar"
            style={{ "--kw": `var(${CHAPTERS[p.chapter].token})` } as React.CSSProperties}
            onClick={() => goTo(p.chapter)}
          >
            <span className="about__pillar-no">{p.no}</span>
            <span className="about__pillar-word">
              {p.word} <em>{CHAPTERS[p.chapter].text} →</em>
            </span>
            <span className="about__pillar-line">{p.line}</span>
            <span className="about__pillar-items">
              {p.items.map((x) => (
                <i key={x}>{x}</i>
              ))}
            </span>
          </button>
        ))}
      </div>

      <p className="about__tools">
        <span>Tools</span>
        {TOOLS.join("  ·  ")}
      </p>
    </section>
  );
}

export default About;
