import type { Work } from "../../data/chapters";

type Props = { work: Work; workIndex: number; detail: boolean; panelNo: number };

const isTbd = (v: string) => v === "작성 예정";

function WorkPanel({ work, workIndex, detail }: Props) {
  const no = String(workIndex + 1).padStart(2, "0");

  if (detail) {
    // 상세 장: 이미지 그리드 (실제 이미지로 교체 예정)
    return (
      <article className="chapter__panel work work--detail" aria-label={`${work.title} 상세`}>
        <header className="work__mini">
          <span className="work__no">{no}</span>
          <span className="work__mini-title">{work.title}</span>
          <span className="work__mini-tag">Detail</span>
        </header>
        <div className="work__grid">
          {[1, 2, 3, 4].map((n) => (
            <div className="work__img" key={n}>
              <span>상세 이미지 {n}</span>
            </div>
          ))}
        </div>
      </article>
    );
  }

  return (
    <article className="chapter__panel work" aria-label={work.title}>
      <div className="work__text">
        <span className="work__no">{no}</span>
        <h3 className="work__title">{work.title}</h3>
        <dl className="work__meta">
          <div>
            <dt>Period</dt>
            <dd>{work.period}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{work.role}</dd>
          </div>
          <div>
            <dt>Tools</dt>
            <dd>{work.tools}</dd>
          </div>
        </dl>
        <p className="work__summary">{work.summary}</p>
        <dl className="work__story">
          {(
            [
              ["Problem", work.problem],
              ["Approach", work.approach],
              ["Result", work.result],
            ] as const
          ).map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd className={isTbd(v) ? "is-tbd" : undefined}>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="work__visual">
        <div className="work__img work__img--main">
          <span>대표 이미지</span>
        </div>
      </div>
    </article>
  );
}

export default WorkPanel;
