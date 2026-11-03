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
    sub: "Requirements, structure, and screen specs",
    token: "--kw-strategy",
    badges: ["Requirements", "IA", "Process", "Screen Spec"],
    desc: "요구사항을 정리하고, 메뉴와 화면 구조를 설계하고,\n화면설계서로 남깁니다.",
    works: [
      {
        id: "kac-main",
        title: "KAC UTM · 로그인 후 메인화면 개편",
        period: "2026",
        role: "기획 · UI 디자인",
        tools: "Figma",
        summary: "발주처 검토 의견에 따라 로그인 후 메인화면의 구성을 처음부터 다시 정리했습니다.",
        problem: "발주처 검토 의견과 원스톱드론서비스 유지 결정으로, 기존 메인화면의 지표 카드와 자동비행승인 신청내역이 더 이상 맞지 않게 되었습니다.",
        approach: "조종자에게 필요 없는 지표·비행구역 카드를 덜어내고, 안전 알림을 맨 위로 올렸습니다. 신청내역은 '비행승인·허가 현황' 하나의 목록으로 합쳤습니다.",
        result: "로그인 후 메인화면 개편안 (전 / 후)",
        panels: 2,
      },
      {
        id: "kac-delivery",
        title: "KAC UTM · 배송 솔루션",
        period: "2026",
        role: "기획 · UI 디자인 · HTML 프로토타입",
        tools: "Figma, HTML/CSS",
        summary: "리서치 자료 없이 실제 배송 과정을 정리해, 조종자와 운영자 화면의 역할을 나눴습니다.",
        problem: "KAC UTM 솔루션 메뉴의 배송 화면을 새로 만들어야 했는데, 배송 과정에 대한 리서치 자료는 없었습니다.",
        approach: "주문부터 로버 수령, 드론 탑재, 배송점 착륙, 로버 배송까지 실제 과정을 5단계로 정리하고, 조종자는 제어, 운영자는 모니터링만 하도록 화면 역할을 나눴습니다.",
        result: "조종자·운영자 화면 배치안 각 3가지 (HTML 프로토타입)",
        panels: 2,
      },
      {
        id: "cju",
        title: "청주대 항공우주 부트캠프사업단 홈페이지",
        period: "2025",
        role: "기획 · 화면설계서 · 퍼블리싱",
        tools: "PowerPoint, HTML/CSS",
        summary: "메뉴 구조와 회원 정책부터 화면설계서까지 직접 정리하고 사이트로 구축했습니다.",
        problem: "사업단 홈페이지를 새로 만들면서, 메인 요구사항과 교육과정·신청 같은 콘텐츠를 화면 구조로 정리해야 했습니다.",
        approach: "1·2depth 메뉴 구조와 아이디·비밀번호·이메일 입력 정책을 정하고, 화면마다 기능 설명을 담은 UI 설계서를 작성했습니다.",
        result: "UI 설계서 34쪽, 홈페이지 퍼블리싱",
        panels: 1,
      },
      {
        id: "uam-booking",
        title: "도심항공교통(UAM) 예약",
        period: "2023",
        role: "기획 · 화면설계",
        tools: "PowerPoint",
        summary: "관제 시스템 안에서 UAM 탑승권을 예약하는 흐름을 4단계로 설계했습니다.",
        problem: "드론 관제 시스템에 도심항공교통(UAM) 예약 기능을 새로 붙여야 했습니다.",
        approach: "조회 → 선택 → 탑승정보 입력 → 결제 4단계로 흐름을 나누고, 출발지·도착지 버티포트 선택과 최근 조회 여정 화면을 설계했습니다.",
        result: "화면설계서 24쪽",
        panels: 1,
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
