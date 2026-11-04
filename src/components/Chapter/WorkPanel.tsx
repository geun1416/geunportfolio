import { fullTitle, type Work } from "../../data/chapters";
import Compare from "../Media/Compare";
import Frame from "../Media/Frame";
import Pins from "../Media/Pins";

type Props = { work: Work; workIndex: number; detail: boolean; page?: number; panelNo: number };

const isTbd = (v: string) => v === "작성 예정";

function WorkPanel({ work, workIndex, detail, page = 0 }: Props) {
  const no = String(workIndex + 1).padStart(2, "0");
  const img = work.images;

  if (detail) {
    // 상세 이미지: 같은 크기 타일 + 틀 위쪽 정렬. 이미지가 없으면 빈 자리 4칸
    const pg = img?.pages?.[page];
    const details = pg?.items ?? img?.details ?? [];
    const layout = pg ? pg.layout : img?.detailLayout;
    const max = layout === "gallery" ? 8 : layout === "top-wide" ? 5 : 4;
    const slots = details.length ? details.slice(0, max) : [null, null, null, null];
    return (
      <article className="chapter__panel work work--detail" aria-label={`${fullTitle(work)} 상세`}>
        <header className="work__mini">
          <span className="work__no">{no}</span>
          <span className="work__mini-title">{fullTitle(work)}</span>
          <span className="work__mini-tag">{pg ? pg.title : "Detail"}</span>
        </header>
        <div className="work__grid" data-count={slots.length} data-layout={layout}>
          {slots.map((d, n) =>
            d ? (
              <figure className={`tile tile--${d.frame ?? "screen"}${d.fit ? ` tile--${d.fit}` : ""}`} key={d.src}>
                <figcaption className="tile__cap">
                  {String(n + 1).padStart(2, "0")} {d.caption}
                </figcaption>
                <Frame kind={d.frame}>
                  <img src={d.src} alt={`${fullTitle(work)} · ${d.caption}`} loading="lazy" decoding="async" />
                </Frame>
              </figure>
            ) : (
              <div className="work__img" key={n}>
                <span>상세 이미지 {n + 1}</span>
              </div>
            )
          )}
        </div>
      </article>
    );
  }

  const hasMain = !!(img?.main || img?.compare);

  return (
    <article className="chapter__panel work" aria-label={fullTitle(work)}>
      <div className="work__text">
        <span className="work__no">{no}</span>
        {work.client && <p className="work__client">{work.client}</p>}
        <h3 className="work__title">{work.title}</h3>
        <dl className="work__meta">
          {work.period && (
            <div>
              <dt>Period</dt>
              <dd>{work.period}</dd>
            </div>
          )}
          <div>
            <dt>Role</dt>
            <dd>{work.role}</dd>
          </div>
          {work.tools && (
            <div>
              <dt>Tools</dt>
              <dd>{work.tools}</dd>
            </div>
          )}
        </dl>
        <p className="work__summary">{work.summary}</p>
        <dl className="work__story">
          {(
            [
              ["상황", work.problem],
              ["한 일", work.approach],
              ["결과물", work.result],
            ] as const
          ).map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd className={isTbd(v) ? "is-tbd" : undefined}>{v}</dd>
            </div>
          ))}
        </dl>
        {work.extras && (
          <div className="work__extras">
            <p className="work__extras-label">그 밖의 작업</p>
            <ul>
              {work.extras.map((x) => (
                <li key={x.src} title={x.caption}>
                  <img src={x.src} alt={x.caption} loading="lazy" decoding="async" />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="work__visual">
        {hasMain ? (
          <div className="stage">
            <Frame kind={img?.frame} className="stage__frame" style={{ "--r": img?.ratio ?? 1.6 } as React.CSSProperties}>
              {img?.compare ? (
                <Compare before={img.compare.before} after={img.compare.after} alt={fullTitle(work)} />
              ) : (
                <img src={img!.main} alt={`${fullTitle(work)} 대표 이미지`} loading="lazy" decoding="async" />
              )}
              {work.pins && work.pins.length > 0 && <Pins pins={work.pins} />}
            </Frame>
          </div>
        ) : (
          <div className="work__img work__img--main">
            <span>대표 이미지</span>
          </div>
        )}
      </div>
    </article>
  );
}

export default WorkPanel;
