import { CHAPTERS } from "../../data/chapters";
import "./About.css";

// 첫 화면 다음, 30초 안에 훑어볼 수 있는 요약
const PILLARS = [
  {
    no: "01",
    word: "기획",
    chapter: 0,
    line: "흩어진 요구사항을 메뉴와 화면 구조로 정리합니다.",
    items: ["요구사항 정리", "메뉴 구조 · IA", "화면설계서"],
  },
  {
    no: "02",
    word: "디자인",
    chapter: 1,
    line: "여러 화면과 매체가 하나처럼 보이도록 기준을 세웁니다.",
    items: ["웹 · 모바일 UI", "디자인 토큰 · 컴포넌트", "인쇄물 · 홍보물", "AI 이미지 생성 후 보정"],
  },
  {
    no: "03",
    word: "설득",
    chapter: 2,
    line: "복잡한 기술과 사업을 한 장의 그림으로 설명합니다.",
    items: ["제안서 · 발표자료", "IR · 기술협력 제안", "인포그래픽 · 다이어그램"],
  },
];

const FACTS = [
  { value: "8년", label: "2019년부터 웹 · 디자인 실무" },
  { value: "17건", label: "포트폴리오에 담은 웹 · 앱 작업" },
  { value: "210쪽", label: "디자인한 제안 · 발표 자료" },
];

const TOOLS = ["Figma", "Photoshop", "Illustrator", "PowerPoint", "HTML/CSS", "ChatGPT · Firefly · Freepik"];

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
