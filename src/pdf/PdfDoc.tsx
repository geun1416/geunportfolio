import type { ReactNode } from "react";
import { CHAPTERS, fullTitle, type Chapter, type Detail, type Layout, type Work } from "../data/chapters";
import { ARCHIVE } from "../data/archive";
import { EMAIL, FACTS, PILLARS, SITE_URL, TOOLS } from "../data/profile";
import "../styles/reset.css";
import "../styles/common.css";
import "./pdf.css";

// 웹과 같은 데이터(chapters · archive · profile)로 만드는 A4 가로 PDF
// 상세 장은 PDF 분량을 위해 고른 것만 넣음 (작업 id → 넣을 상세 장 번호)
const DETAIL_PAGES: Record<string, number[]> = {
  "kac-main": [0],
  "kac-delivery": [0],
  "pal-home": [0],
  haemileum: [2],
  kazakhstan: [0],
  "kuam-gc": [0],
};

type Page = { chapter?: Chapter; node: (no: number) => ReactNode };

const pad = (n: number) => String(n).padStart(2, "0");

function Sheet({ no, chapter, children, className = "" }: { no: number; chapter?: Chapter; children: ReactNode; className?: string }) {
  return (
    <section className={`sheet ${className}`} style={chapter ? ({ "--kw": `var(${chapter.token})` } as React.CSSProperties) : undefined}>
      {children}
      <footer className="sheet__foot">
        <span>Kim Jieun · Portfolio 2026</span>
        <span>{chapter ? chapter.text : ""}</span>
        <span>{pad(no)}</span>
      </footer>
    </section>
  );
}

function Img({ src, alt, frame }: { src: string; alt: string; frame?: string }) {
  return (
    <div className={`pimg pimg--${frame ?? "screen"}`}>
      <img src={src} alt={alt} />
    </div>
  );
}

/** 상세 이미지 목록 (작업의 pages 또는 details) */
const detailsOf = (w: Work, page: number): { title: string; layout?: Layout; items: Detail[] } => {
  const pg = w.images?.pages?.[page];
  if (pg) return pg;
  return { title: "Detail", layout: w.images?.detailLayout, items: w.images?.details ?? [] };
};

function Overview({ w, index, chapter, hideExtras }: { w: Work; index: number; chapter: Chapter; hideExtras?: boolean }) {
  const img = w.images;
  return (
    <div className="ov">
      <div className="ov__text">
        <p className="ov__no">{pad(index + 1)}</p>
        {w.client && <p className="ov__client">{w.client}</p>}
        <h2 className="ov__title">{w.title}</h2>
        <dl className="ov__meta">
          {w.period && (
            <div>
              <dt>Period</dt>
              <dd>{w.period}</dd>
            </div>
          )}
          <div>
            <dt>Role</dt>
            <dd>{w.role}</dd>
          </div>
          {w.tools && (
            <div>
              <dt>Tools</dt>
              <dd>{w.tools}</dd>
            </div>
          )}
        </dl>
        <p className="ov__summary">{w.summary}</p>
        <dl className="ov__story">
          {(
            [
              ["상황", w.problem],
              ["한 일", w.approach],
              ["결과물", w.result],
            ] as const
          ).map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        {w.pins && (
          <ol className="ov__pins">
            {w.pins.map((p) => (
              <li key={p.text}>{p.text}</li>
            ))}
          </ol>
        )}
        {w.link && (
          <a className="ov__link" href={w.link.url}>
            {w.link.label} ↗
          </a>
        )}
        {w.note && <p className="ov__note">※ {w.note}</p>}
        {w.extras && !hideExtras && (
          <div className="ov__extras">
            <p>그 밖의 작업</p>
            <div>
              {w.extras.map((x) => (
                <img key={x.src} src={x.src} alt={x.caption} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="ov__visual">
        {img?.compare ? (
          <div className="ov__compare" style={{ "--r": img.ratio ?? 1.6 } as React.CSSProperties}>
            {(["before", "after"] as const).map((k) => (
              <figure key={k}>
                <figcaption>{k === "before" ? "Before" : "After"}</figcaption>
                <div className="ov__frame">
                  <Img src={img.compare![k]} alt={`${fullTitle(w)} ${k}`} frame={img.frame} />
                  {k === "after" &&
                    w.pins?.map((p, i) => (
                      <span key={p.text} className="ov__pin" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                        {i + 1}
                      </span>
                    ))}
                </div>
              </figure>
            ))}
          </div>
        ) : img?.main ? (
          <div className="ov__single">
            <div className="ov__frame" style={{ aspectRatio: String(img.ratio ?? 1.6), "--r": img.ratio ?? 1.6 } as React.CSSProperties}>
              <Img src={img.main} alt={fullTitle(w)} frame={img.frame} />
              {w.pins?.map((p, i) => (
                <span key={p.text} className="ov__pin" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                  {i + 1}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <span className="ov__chapter">{chapter.text}</span>
    </div>
  );
}

type DetailData = { title: string; layout?: Layout; items: Detail[] };

function DetailSheet({ w, index, page, data }: { w: Work; index: number; page: number; data?: DetailData }) {
  const d = data ?? detailsOf(w, page);
  const isRearrange = !data && !!w.images?.rearrange && page === 0;
  return (
    <div className="dt">
      <header className="dt__head">
        <span className="dt__no">{pad(index + 1)}</span>
        <span className="dt__title">{fullTitle(w)}</span>
        <span className="dt__tag">{d.title}</span>
      </header>
      <div className="dt__grid" data-layout={d.layout ?? ""} data-count={d.items.length}>
        {d.items.map((it, n) => (
          <figure key={it.src} className="dt__cell">
            <figcaption>
              {pad(n + 1)} {it.caption.replace("토큰 바꿔 보기 · ", "")}
            </figcaption>
            <div className="dt__img">
              <img src={it.src} alt={it.caption} />
            </div>
          </figure>
        ))}
      </div>
      {isRearrange && (
        <div className="dt__map">
          <p>바뀐 구조</p>
          <ul>
            {w.images!.rearrange!.map((b) => (
              <li key={b.label} className={!b.to ? "is-out" : !b.from ? "is-new" : ""}>
                {!b.from ? "새로 추가" : b.label} <i>→</i> {!b.to ? "삭제" : b.toLabel ?? b.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// 지원 분야에 따라 순서를 바꾼 버전: pdf.html?v=commerce → 이미지·프로모션·인쇄물 먼저
const VARIANT = new URLSearchParams(window.location.search).get("v");

const byId = (id: string) => {
  for (const ch of CHAPTERS) {
    const wi = ch.works.findIndex((w) => w.id === id);
    if (wi >= 0) return { ch, w: ch.works[wi], wi };
  }
  throw new Error(`작업을 찾을 수 없음: ${id}`);
};

// 커머스 버전의 첫 묶음 (챕터 데이터 대신 쓰는 표지 정보)
const VISUAL: Chapter = {
  id: "visual",
  text: "Visual",
  sub: "",
  token: "--kw-design",
  badges: ["AI Product Image", "Promotion", "Print", "Branding"],
  desc: "상품과 브랜드를 보여 주는 이미지,\n판매를 이끄는 프로모션과 인쇄물.",
  works: [],
};

const FREELANCE_DETAILS: DetailData[] = [
  {
    title: "AI 상품컷 · 니트 4컬러",
    layout: "gallery",
    items: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ src: `/works/freelance/cut-${n}.webp`, caption: ["디테일", "그레이 · 상의", "그레이 · 전신", "그레이 · 메인", "베이지 · 메인", "브라운 · 모델", "아이보리 · 메인", "그레이 · 얼굴"][n - 1] })),
  },
  {
    title: "로고 · 이벤트 · 현수막",
    layout: "top-wide",
    items: [
      { src: "/works/freelance/logo-biz.webp", caption: "로고 · 비즈제작소" },
      { src: "/works/freelance/logo-jdeco.webp", caption: "로고 · JDECO" },
      { src: "/works/freelance/spoany-1.webp", caption: "헬스장 이벤트 · 반짝 이벤트" },
      { src: "/works/freelance/spoany-2.webp", caption: "헬스장 이벤트 · 이용권 기획전" },
      { src: "/works/freelance/banner.webp", caption: "현수막" },
    ],
  },
];

// UI/UX 작업을 한 장에 모아 보여 주는 요약 (커머스 버전)
const UI_SUMMARY = [
  { id: "pal-home", src: "/works/pal-home/compare-after.webp" },
  { id: "kac-main", src: "/works/kac-main/compare-after.webp" },
  { id: "kac-dashboard", src: "/works/kac-dashboard/compare-after.webp" },
  { id: "haemileum", src: "/works/haemileum/main.webp" },
  { id: "kac-delivery", src: "/works/kac-delivery/main.webp" },
  { id: "cju", src: "/works/cju/main.webp" },
];

function PdfDoc() {
  const pages: Page[] = [];
  const commerce = VARIANT === "commerce";

  pages.push({
    node: (no) => (
      <Sheet no={no} className="cover">
        <p className="cover__label">UI/UX · Visual Designer · Since 2019</p>
        <h1 className="cover__name">
          Kim Jieun <span>김지은</span>
        </h1>
        <p className="cover__tag">
          <em className="c1">기획하고,</em> <em className="c2">디자인하고,</em> <em className="c3">설득합니다.</em>
        </p>
        <p className="cover__desc">복잡한 이야기를 한 장으로 정리합니다.</p>
        <p className="cover__foot">Portfolio 2026</p>
      </Sheet>
    ),
  });

  pages.push({
    node: (no) => (
      <Sheet no={no} className="about">
        <p className="eyebrow">About</p>
        <h2 className="about__title">
          웹 화면부터 인쇄물, 제안서까지
          <br />
          보이는 것은 모두 디자인합니다.
        </h2>
        <p className="about__desc">
          웹 디자인과 퍼블리싱으로 시작해 화면 기획과 제안서 디자인까지 맡아 왔습니다. 복잡한 내용을 정리해 한눈에 보이는 화면과 문서로 만드는 일을 합니다.
        </p>
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
            <div key={p.word} style={{ "--kw": `var(${CHAPTERS[p.chapter].token})` } as React.CSSProperties}>
              <span className="about__no">
                {p.no} · {CHAPTERS[p.chapter].text}
              </span>
              <strong>{p.word}</strong>
              <p>{p.line}</p>
              <span className="about__items">
                {p.items.map((x) => (
                  <i key={x}>{x}</i>
                ))}
              </span>
            </div>
          ))}
        </div>
        <p className="about__tools">
          <span>Tools</span>
          {TOOLS.join("  ·  ")}
        </p>
      </Sheet>
    ),
  });

  const chapterCover = (ch: Chapter, label: number, works: Work[]) =>
    pages.push({
      chapter: ch,
      node: (no) => (
        <Sheet no={no} chapter={ch} className="chap">
          <p className="chap__no">{pad(label)}</p>
          <h2 className="chap__word">{ch.text}</h2>
          <p className="chap__desc">{ch.desc}</p>
          <div className="chap__badges">
            {ch.badges.map((b) => (
              <span key={b}>{b}</span>
            ))}
          </div>
          <ol className="chap__list">
            {works.map((w, wi) => (
              <li key={w.id}>
                <span>{pad(wi + 1)}</span>
                <strong>{fullTitle(w)}</strong>
                <em>{w.role}</em>
              </li>
            ))}
          </ol>
        </Sheet>
      ),
    });
  const overview = (ch: Chapter, w: Work, wi: number, hideExtras = false) =>
    pages.push({ chapter: ch, node: (no) => <Sheet no={no} chapter={ch}><Overview w={w} index={wi} chapter={ch} hideExtras={hideExtras} /></Sheet> });
  const detail = (ch: Chapter, w: Work, wi: number, pg: number, data?: DetailData) =>
    pages.push({ chapter: ch, node: (no) => <Sheet no={no} chapter={ch}><DetailSheet w={w} index={wi} page={pg} data={data} /></Sheet> });

  if (commerce) {
    // 01 Visual: 상품 이미지 · 프로모션 · 인쇄물
    const fl = byId("freelance");
    const pr = byId("print");
    const visualCh = { ...VISUAL, works: [fl.w, pr.w] };
    chapterCover(visualCh, 1, [fl.w, pr.w]);
    overview(visualCh, fl.w, 0, true);
    FREELANCE_DETAILS.forEach((d) => detail(visualCh, fl.w, 0, 0, d));
    overview(visualCh, pr.w, 1);
    [0, 1].forEach((pg) => detail(visualCh, pr.w, 1, pg));

    // 02 Proposal: 제안 · 기획 자료
    const prop = CHAPTERS[2];
    chapterCover(prop, 2, prop.works);
    prop.works.forEach((w, wi) => {
      overview(prop, w, wi);
      detail(prop, w, wi, 0);
    });

    // 03 UI/UX: 한 장 요약 + 디자인 시스템
    const uiCh: Chapter = { ...CHAPTERS[0], text: "UI/UX" };
    pages.push({
      chapter: uiCh,
      node: (no) => (
        <Sheet no={no} chapter={uiCh} className="uisum">
          <p className="chap__no">03</p>
          <h2 className="uisum__title">UI/UX · 웹</h2>
          <p className="uisum__desc">웹 · 앱 화면의 기획과 디자인, 퍼블리싱. 자세한 과정은 웹 포트폴리오에서 보실 수 있습니다.</p>
          <div className="uisum__grid">
            {UI_SUMMARY.map((u) => {
              const { w } = byId(u.id);
              return (
                <figure key={u.id}>
                  <div className="uisum__img">
                    <img src={u.src} alt={fullTitle(w)} />
                  </div>
                  <figcaption>
                    <strong>{fullTitle(w)}</strong>
                    <span>{w.role}</span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </Sheet>
      ),
    });
    const hm = byId("haemileum");
    detail(uiCh, hm.w, 0, 2);
  }

  if (!commerce) CHAPTERS.forEach((ch, ci) => {
    pages.push({
      chapter: ch,
      node: (no) => (
        <Sheet no={no} chapter={ch} className="chap">
          <p className="chap__no">{pad(ci + 1)}</p>
          <h2 className="chap__word">{ch.text}</h2>
          <p className="chap__desc">{ch.desc}</p>
          <div className="chap__badges">
            {ch.badges.map((b) => (
              <span key={b}>{b}</span>
            ))}
          </div>
          <ol className="chap__list">
            {ch.works.map((w, wi) => (
              <li key={w.id}>
                <span>{pad(wi + 1)}</span>
                <strong>{fullTitle(w)}</strong>
                <em>{w.role}</em>
              </li>
            ))}
          </ol>
        </Sheet>
      ),
    });
    ch.works.forEach((w, wi) => {
      pages.push({ chapter: ch, node: (no) => <Sheet no={no} chapter={ch}><Overview w={w} index={wi} chapter={ch} /></Sheet> });
      (DETAIL_PAGES[w.id] ?? []).forEach((pg) =>
        pages.push({ chapter: ch, node: (no) => <Sheet no={no} chapter={ch}><DetailSheet w={w} index={wi} page={pg} /></Sheet> })
      );
    });
  });

  pages.push({
    node: (no) => (
      <Sheet no={no} className="arch">
        <div className="arch__head">
          <p className="eyebrow">Archive</p>
          <h2>2019 — 2025</h2>
          <p>2019년부터 이어 온 웹·모바일 디자인과 퍼블리싱 작업입니다. 홈페이지, 예약 서비스, QR 출입, 앱까지 여러 분야의 화면을 만들었습니다.</p>
        </div>
        <ul className="arch__list">
          {ARCHIVE.map((a) => (
            <li key={a.title}>
              <span className="arch__year">{a.year}</span>
              <span className="arch__thumb">{a.thumb && <img src={`/works/archive/${a.thumb}.webp`} alt="" />}</span>
              <span className="arch__name">
                {a.title}
                {a.client && <em>{a.client}</em>}
              </span>
              <span className="arch__role">{a.role.join(" · ")}</span>
            </li>
          ))}
        </ul>
      </Sheet>
    ),
  });

  pages.push({
    node: (no) => (
      <Sheet no={no} className="end">
        <p className="eyebrow">Contact</p>
        <h2 className="end__title">함께 일할 기회를 기다립니다.</h2>
        <a className="end__mail" href={`mailto:${EMAIL}`}>
          {EMAIL}
        </a>
        <div className="end__web">
          <img src="/pdf/qr.svg" alt="웹 포트폴리오 QR 코드" />
          <div>
            <p>웹 포트폴리오</p>
            <a href={SITE_URL}>{SITE_URL.replace("https://", "").replace(/\/$/, "")}</a>
            <span>화면이 움직이는 재배치 애니메이션, 토큰 바꿔 보기는 웹에서 직접 보실 수 있습니다.</span>
          </div>
        </div>
      </Sheet>
    ),
  });

  return <main className="pdf">{pages.map((p, i) => <div key={i}>{p.node(i + 1)}</div>)}</main>;
}

export default PdfDoc;
