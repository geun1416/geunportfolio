// 포트폴리오 본문 데이터 — 챕터(역량) 4개와 각 챕터의 작업물
// "작성 예정" 표시는 아직 내용을 정하지 않은 자리

export type Work = {
  id: string;
  title: string;
  period: string;
  role: string;
  tools: string;
  summary: string;
  problem: string;
  approach: string;
  result: string;
  /** 1: 개요 한 장, 2: 개요 + 상세 이미지 한 장 */
  panels: 1 | 2;
};

export type Chapter = {
  id: string;
  text: string;
  sub: string;
  token: string; // 테마 색 CSS 변수
  badges: string[];
  desc: string;
  works: Work[];
};

const TBD = "작성 예정";

export const CHAPTERS: Chapter[] = [
  {
    id: "strategy",
    text: "Strategy",
    sub: "Research, planning, and structuring the problem",
    token: "--kw-strategy",
    badges: ["Requirements", "IA", "User Flow", "Wireframe"],
    desc: "이해관계자 요구 정리, 정보구조 설계, 사용자 흐름 정의.\n막연한 문제를 실행 가능한 구조로 바꾸는 단계.",
    works: [
      {
        id: "kac-main",
        title: "KAC UTM 메인 화면 재설계",
        period: "2026",
        role: "기획 · UI 디자인",
        tools: "Figma",
        summary: "드론 운영자 설문으로 메인 화면의 우선순위를 다시 정했습니다.",
        problem: "초기 요구사항으로 들어온 카드와 지표가 많아, 조종자에게 정말 필요한 정보가 묻혀 있었습니다.",
        approach: "드론 운영자 7명에게 업무 중요도를 설문해, 점수가 낮은 지표와 카드는 덜어내고 안전 알림을 최상단으로 올렸습니다.",
        result: "중요도 만점(5.00)을 받은 비행승인·허가 현황을 중심으로 화면을 다시 구성했습니다.",
        panels: 2,
      },
      {
        id: "drone-delivery",
        title: "드론배송 관제 대시보드",
        period: "2026",
        role: "기획 · UI 디자인 · HTML 프로토타입",
        tools: "Figma, HTML/CSS",
        summary: "리서치가 없는 상황에서 실제 배송 과정을 분석해 역할별 화면을 설계했습니다.",
        problem: "배송 프로세스에 대한 별도 리서치 없이 조종자 대시보드 시안을 만들어야 했습니다.",
        approach: "주문부터 로버·드론 배송까지 5단계를 정리하고, 조종자는 제어, 운영자는 모니터링 전용으로 화면 역할을 나눴습니다.",
        result: "정보패널 분할형, 목록 좌측형, 하단 통합형 세 가지 배치 컨셉을 제시했습니다.",
        panels: 2,
      },
    ],
  },
  {
    id: "design",
    text: "Design",
    sub: "UI/UX, visual systems, and interaction design",
    token: "--kw-design",
    badges: ["UI Design", "Design System", "Dashboard", "Figma"],
    desc: "구조를 시각 언어로 옮기고,\n여러 화면이 하나처럼 보이도록 기준을 세우는 단계.",
    works: [
      {
        id: "pal-home",
        title: "PAL Networks 홈페이지 리뉴얼",
        period: "2026 · 2주",
        role: "기획 · 메인 디자인 · 공통 스타일 정의 · 퍼블리싱",
        tools: "Figma, React",
        summary: "회사가 무엇을 하는지 한눈에 보이도록 정체성부터 다시 정의했습니다.",
        problem: "주력 사업이 드론·UTM으로 바뀌었는데, 예전 사이트로는 회사가 무엇을 하는지 알기 어려웠습니다.",
        approach: "사이트 카피 전체를 직접 쓰고, UTM/UATM을 1depth 메뉴로 올렸습니다. 공통 스타일을 먼저 정해 주니어와 서브페이지를 나눠 작업했습니다.",
        result: "2명이 2주 안에 일관된 사이트를 완성했습니다. palnet.co.kr",
        panels: 2,
      },
      {
        id: "kac-service",
        title: "KAC UTM 서비스 · 관리자 화면",
        period: "2024 – 2026",
        role: "UI 디자인 · 퍼블리싱",
        tools: "Figma, Next.js",
        summary: "회원유형별 서비스 페이지와 관리자 대시보드를 하나의 디자인 기준으로 정리했습니다.",
        problem: TBD,
        approach: TBD,
        result: TBD,
        panels: 1,
      },
      {
        id: "haemileum",
        title: "해밀이음 에듀테크 플랫폼",
        period: "2026",
        role: "UI 디자인",
        tools: "Figma",
        summary: "학생을 위한 읽기 학습 플랫폼의 화면을 디자인했습니다.",
        problem: TBD,
        approach: TBD,
        result: TBD,
        panels: 1,
      },
    ],
  },
  {
    id: "proposal",
    text: "Proposal",
    sub: "Proposals, IR decks, and documents that persuade",
    token: "--kw-proposal",
    badges: ["Proposal", "IR Deck", "Infographic", "Editorial"],
    desc: "대상에 맞춰 메시지를 정리하고,\n복잡한 내용을 한 장의 그림으로 설득하는 단계.",
    works: [
      {
        id: "kazakhstan",
        title: "카자흐스탄 UTM/UATM 개발 제안 요약서",
        period: "2026 · 51p · 영문",
        role: "기획 참여 · 디자인",
        tools: "PowerPoint, 생성형 AI",
        summary: "해외 발주처를 위한 영문 제안 요약서를 기획부터 디자인까지 맡았습니다.",
        problem: TBD,
        approach: TBD,
        result: TBD,
        panels: 2,
      },
      {
        id: "kuam-gc",
        title: "K-UAM GC 제안서 · 발표자료",
        period: "2026 · 86p + 15p",
        role: "기획 참여 · 디자인",
        tools: "PowerPoint, 생성형 AI",
        summary: "A4 제안서와 16:9 발표자료를 하나의 디자인 시스템으로 전개했습니다.",
        problem: TBD,
        approach: TBD,
        result: TBD,
        panels: 2,
      },
      {
        id: "ir",
        title: "IR · 기업 제안 자료",
        period: "2026",
        role: "기획 참여 · 디자인",
        tools: "PowerPoint, 생성형 AI",
        summary: "투자자와 대기업, 대상마다 다른 톤으로 회사의 이야기를 정리했습니다.",
        problem: TBD,
        approach: TBD,
        result: TBD,
        panels: 1,
      },
      {
        id: "print",
        title: "리플렛 · 포스터 · 대형 배너",
        period: "2025 – 2026",
        role: "디자인",
        tools: "Figma, Illustrator",
        summary: "전시와 홍보를 위한 인쇄물을 만들었습니다.",
        problem: TBD,
        approach: TBD,
        result: TBD,
        panels: 1,
      },
    ],
  },
  {
    id: "lead",
    text: "Lead",
    sub: "Directing teams and owning outcomes",
    token: "--kw-lead",
    badges: ["Direction", "Review", "Deliverables", "Collaboration"],
    desc: "디자인 방향을 정하고,\n팀이 같은 기준으로 일하도록 체계와 산출물을 관리하는 단계.",
    works: [
      {
        id: "style-guide",
        title: "디자인 스타일가이드",
        period: "2024",
        role: "디자인 리드",
        tools: "Figma",
        summary: "KAC UTM 사용자 웹과 관리자 화면의 디자인 기준을 문서로 정리했습니다.",
        problem: TBD,
        approach: TBD,
        result: TBD,
        panels: 1,
      },
      {
        id: "deliverables",
        title: "UI설계서 · 사용자 매뉴얼 · 산출물",
        period: "2024 – 2026",
        role: "산출물 작성 · 관리",
        tools: "PowerPoint, Figma",
        summary: "발주처에 제출하는 설계서와 매뉴얼을 화면 단위로 정리하고 관리했습니다.",
        problem: TBD,
        approach: TBD,
        result: TBD,
        panels: 1,
      },
      {
        id: "team",
        title: "디자인 체계와 협업 방식",
        period: "2024 – 2026",
        role: "디자인 리드",
        tools: "Figma",
        summary: "타이포 12단계, 그리드, 공통 컴포넌트로 팀이 같은 기준에서 일하게 했습니다.",
        problem: TBD,
        approach: TBD,
        result: TBD,
        panels: 1,
      },
    ],
  },
];

/** 챕터의 가로 장 목록: [표지, 작업물1 개요, (작업물1 상세), ...] */
export type Panel = { kind: "cover" } | { kind: "work"; work: Work; index: number } | { kind: "detail"; work: Work; index: number };

export const panelsOf = (chapter: Chapter): Panel[] => {
  const list: Panel[] = [{ kind: "cover" }];
  chapter.works.forEach((work, index) => {
    list.push({ kind: "work", work, index });
    if (work.panels === 2) list.push({ kind: "detail", work, index });
  });
  return list;
};

/** 작업물이 시작하는 장 번호 */
export const workPanelIndex = (chapter: Chapter, workIndex: number) =>
  panelsOf(chapter).findIndex((p) => p.kind === "work" && p.index === workIndex);
