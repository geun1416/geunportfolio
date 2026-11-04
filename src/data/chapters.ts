// 포트폴리오 본문 데이터 — 챕터(역량) 4개와 각 챕터의 작업물
// "작성 예정" 표시는 아직 내용을 정하지 않은 자리

export type Work = {
  id: string;
  /** 소속·시스템명 (제목 위 작은 라벨, 목차에서는 "소속 · 제목"으로 표시) */
  client?: string;
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
  /** public/works/ 아래 이미지. 없으면 빈 자리 표시 */
  images?: {
    /** 대표 이미지 한 장 */
    main?: string;
    /** 대표 이미지 가로/세로 비율 (기본 16/10) */
    ratio?: number;
    /** 프레임 종류: screen = 브라우저 창, doc = 종이 문서 (기본 screen) */
    frame?: Frame;
    /** 있으면 대표 이미지 대신 전·후 비교 슬라이더 */
    compare?: { before: string; after: string };
    details?: Detail[];
    /** 상세 배치: "feature-left" = 첫 이미지를 왼쪽 세로로 크게, 나머지는 오른쪽에 세로로 나열 */
    detailLayout?: Layout;
    /** 상세 장이 여러 장일 때: 장마다 제목·배치·이미지 (있으면 details 대신 사용) */
    pages?: DetailPage[];
  };
  /** 개요 장 아래쪽에 작게 붙이는 그 밖의 작업 썸네일 */
  extras?: { src: string; caption: string }[];
  /** 대표 이미지 위 번호 핀 (x·y: 이미지 기준 %) */
  pins?: Pin[];
};

export type Pin = { x: number; y: number; text: string };
/** screen = 브라우저 창, doc = 종이 문서, plain = 틀 없이 이미지만 (인쇄물·사진) */
export type Frame = "screen" | "doc" | "plain";
/** fit: contain = 자르지 않고 전체를 보여 줌, width = 가로를 꽉 채우고 위에서부터 (긴 페이지) */
export type Detail = { src: string; caption: string; frame?: Frame; fit?: "contain" | "width" };
/** feature-left: 첫 장 왼쪽 크게 / feature-top: 첫 장 위에 가로로 크게 / row: 한 줄 / gallery: 4×2 / top-wide: 위 여러 장 + 아래 가로 한 장 */
export type Layout = "feature-left" | "feature-top" | "row" | "gallery" | "top-wide";
export type DetailPage = { title: string; layout?: Layout; items: Detail[] };

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
        client: "KAC UTM",
        title: "로그인 후 메인화면 개편",
        period: "2026",
        role: "기획 · UI 디자인",
        tools: "Figma",
        summary: "발주처 검토 의견에 따라 로그인 후 메인화면의 구성을 처음부터 다시 정리했습니다.",
        problem: "발주처 검토 의견과 원스톱드론서비스 유지 결정으로, 기존 메인화면의 지표 카드와 자동비행승인 신청내역이 더 이상 맞지 않게 되었습니다.",
        approach: "조종자에게 필요 없는 지표·비행구역 카드를 덜어내고, 안전 알림을 맨 위로 올렸습니다. 신청내역은 '비행승인·허가 현황' 하나의 목록으로 합쳤습니다.",
        result: "로그인 후 메인화면 개편안 (전 / 후)",
        panels: 2,
        images: {
          ratio: 1920 / 1435,
          compare: { before: "/works/kac-main/compare-before.webp", after: "/works/kac-main/compare-after.webp" },
          details: [
            { src: "/works/kac-main/detail-1.webp", caption: "개편 전" },
            { src: "/works/kac-main/detail-2.webp", caption: "개편안 1" },
            { src: "/works/kac-main/detail-3.webp", caption: "개편안 2" },
          ],
        },
        pins: [
          { x: 62, y: 12, text: "안전 알림을 화면 맨 위로" },
          { x: 24, y: 30, text: "흩어져 있던 신청내역을 '비행승인·허가 현황' 하나의 목록으로" },
          { x: 74, y: 38, text: "구독 유도 배너는 오른쪽에 유지" },
          { x: 30, y: 70, text: "공지사항·자료실은 탭으로 묶어 하단에 유지" },
        ],
      },
      {
        id: "kac-delivery",
        client: "KAC UTM",
        title: "배송 솔루션",
        period: "2026",
        role: "기획 · UI 디자인 · HTML 프로토타입",
        tools: "Figma, HTML/CSS",
        summary: "리서치 자료 없이 실제 배송 과정을 정리해, 조종자와 운영자 화면의 역할을 나눴습니다.",
        problem: "KAC UTM 솔루션 메뉴의 배송 화면을 새로 만들어야 했는데, 배송 과정에 대한 리서치 자료는 없었습니다.",
        approach: "주문부터 로버 수령, 드론 탑재, 배송점 착륙, 로버 배송까지 실제 과정을 5단계로 정리하고, 조종자는 제어, 운영자는 모니터링만 하도록 화면 역할을 나눴습니다.",
        result: "조종자·운영자 화면 배치안 각 3가지 (HTML 프로토타입)",
        panels: 2,
        images: {
          main: "/works/kac-delivery/main.webp",
          ratio: 2,
          details: [
            { src: "/works/kac-delivery/detail-1.webp", caption: "기획안 · 배송 5단계", frame: "doc" },
            { src: "/works/kac-delivery/detail-2.webp", caption: "1안 · 정보패널 분할형" },
            { src: "/works/kac-delivery/detail-3.webp", caption: "2안 · 하단 목록바형" },
            { src: "/works/kac-delivery/detail-4.webp", caption: "3안 · 하단 통합조종콘솔형" },
          ],
          detailLayout: "feature-left",
        },
        pins: [
          { x: 24, y: 3, text: "배치 컨셉 3가지를 탭으로 바로 비교" },
          { x: 30, y: 48, text: "지도 위에 드론·로버 위치와 비행 경로" },
          { x: 69, y: 50, text: "드론 영상과 배송점 CCTV를 한 화면에" },
          { x: 88, y: 14, text: "비행 제어는 조종자 화면에만" },
        ],
      },
      {
        id: "cju",
        client: "청주대학교",
        title: "항공우주 부트캠프사업단 홈페이지",
        period: "2025",
        role: "기획 · 화면설계서 · 퍼블리싱",
        tools: "PowerPoint, HTML/CSS",
        summary: "메뉴 구조와 회원 정책부터 화면설계서까지 직접 정리하고 사이트로 구축했습니다.",
        problem: "사업단 홈페이지를 새로 만들면서, 메인 요구사항과 교육과정·신청 같은 콘텐츠를 화면 구조로 정리해야 했습니다.",
        approach: "1·2depth 메뉴 구조와 아이디·비밀번호·이메일 입력 정책을 정하고, 화면마다 기능 설명을 담은 UI 설계서를 작성했습니다.",
        result: "UI 설계서 34쪽, 홈페이지 퍼블리싱",
        panels: 2,
        images: {
          main: "/works/cju/main.webp",
          ratio: 2267 / 1161,
          frame: "doc",
          details: [
            { src: "/works/cju/detail-1.webp", caption: "메뉴 구조", frame: "doc" },
            { src: "/works/cju/detail-2.webp", caption: "아이디 · 비밀번호 정책", frame: "doc" },
            { src: "/works/cju/detail-3.webp", caption: "메인 화면 설계", frame: "doc" },
            { src: "/works/cju/detail-4.webp", caption: "관리자 · 회원 목록", frame: "doc" },
          ],
        },
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
        panels: 2,
        images: {
          main: "/works/uam-booking/main.webp",
          ratio: 2544 / 1761,
          frame: "doc",
          details: [
            { src: "/works/uam-booking/detail-1.webp", caption: "출발지 선택", frame: "doc" },
            { src: "/works/uam-booking/detail-2.webp", caption: "날짜 선택", frame: "doc" },
            { src: "/works/uam-booking/detail-3.webp", caption: "항공편 선택", frame: "doc" },
            { src: "/works/uam-booking/detail-4.webp", caption: "예약 완료", frame: "doc" },
          ],
        },
      },
    ],
  },
  {
    id: "design",
    text: "Design",
    sub: "UI/UX, visual systems, and interaction design",
    token: "--kw-design",
    badges: ["UI Design", "Design Token", "Print", "AI Image"],
    desc: "구조를 시각 언어로 옮기고,\n여러 화면이 하나처럼 보이도록 기준을 세우는 단계.",
    works: [
      {
        id: "pal-home",
        client: "PAL Networks",
        title: "홈페이지 리뉴얼",
        period: "2026 · 2주",
        role: "기획 · 메인 디자인 · 공통 스타일 정의 · 퍼블리싱",
        tools: "Figma, React",
        summary: "회사가 무엇을 하는지 한눈에 보이도록 정체성부터 다시 정의했습니다.",
        problem: "주력 사업이 드론·UTM으로 바뀌었는데, 예전 사이트로는 회사가 무엇을 하는지 알기 어려웠습니다.",
        approach: "사이트 카피 전체를 직접 쓰고, UTM/UATM을 1depth 메뉴로 올렸습니다. 공통 스타일을 먼저 정해 주니어와 서브페이지를 나눠 작업했습니다.",
        result: "2명이 2주 안에 일관된 사이트를 완성했습니다. palnet.co.kr",
        panels: 2,
        images: {
          ratio: 16 / 9,
          compare: { before: "/works/pal-home/compare-before.webp", after: "/works/pal-home/compare-after.webp" },
          pages: [
            {
              title: "주요 화면",
              items: [
                { src: "/works/pal-home/detail-1.webp", caption: "UTM 통합 플랫폼" },
                { src: "/works/pal-home/detail-2.webp", caption: "도심항공교통(UAM)" },
                { src: "/works/pal-home/detail-3.webp", caption: "항공 IT 솔루션" },
                { src: "/works/pal-home/detail-4.webp", caption: "새소식" },
              ],
            },
          ],
        },
      },
      {
        id: "kac-dashboard",
        client: "KAC UTM",
        title: "관리자 대시보드 리디자인",
        period: "",
        role: "UI 디자인 · HTML 시안",
        tools: "HTML/CSS",
        summary: "같은 크기로 나열돼 있던 현황 정보를 지금 처리할 일과 지도 중심으로 다시 배치했습니다.",
        problem: "신청 현황, 통계, 지도, 공지가 모두 비슷한 카드로 나열돼 있어 관리자가 무엇부터 봐야 할지 알기 어려웠습니다.",
        approach: "지금 확인해야 할 건수를 맨 위에 크게 두고, 비행 현황 통계와 공역 지도, 공지·문의를 영역별로 묶었습니다.",
        result: "관리자 대시보드 리디자인 시안 (HTML)",
        panels: 1,
        images: {
          ratio: 16 / 9,
          compare: { before: "/works/kac-dashboard/compare-before.webp", after: "/works/kac-dashboard/compare-after.webp" },
        },
      },
      {
        id: "haemileum",
        client: "해밀이음",
        title: "읽기 학습 플랫폼",
        period: "",
        role: "UI 디자인 리드 (부사수와 2인)",
        tools: "Figma (Variables · Prototype)",
        summary: "초등학생이 글 한 편을 단계별로 읽어 나가는 학습 화면을 디자인하고, 디자인 토큰으로 스타일을 관리했습니다.",
        problem: "학년마다 난이도가 다른 읽기 학습을 하나의 흐름 안에서 보여 줘야 했습니다.",
        approach: "학습을 범위 선택 → 한 문장씩 다이어트 → 주요 낱말 → 전체 글·퀴즈 → 완료 리포트 5단계 탭으로 나누고, 캐릭터와 배경으로 단계마다 같은 분위기를 이어 갔습니다. 색·글자·간격·라운드 값은 Figma Variables로 global → semantic(라이트/다크) 토큰으로 정리해 JSON으로 내보냈고, 이 기준으로 부사수와 화면을 나눠 작업했습니다.",
        result: "학습 화면 5단계, 서비스 화면, 디자인 토큰(JSON), 컴포넌트 가이드, 프로토타입 플로우",
        panels: 2,
        images: {
          main: "/works/haemileum/main.webp",
          ratio: 1600 / 759,
          pages: [
            {
              title: "학습 흐름",
              items: [
                { src: "/works/haemileum/flow-1.webp", caption: "한 문장씩 다이어트" },
                { src: "/works/haemileum/flow-2.webp", caption: "주요 낱말" },
                { src: "/works/haemileum/flow-3.webp", caption: "전체 글 읽기 · 퀴즈 (5·6학년)" },
                { src: "/works/haemileum/flow-4.webp", caption: "완료 리포트" },
              ],
            },
            {
              title: "서비스 화면",
              items: [{ src: "/works/haemileum/service-collage.webp", caption: "메인 · 글 목록 · 회원가입 유형 선택 · 학부모 회원가입", frame: "plain", fit: "contain" }],
            },
            {
              title: "디자인 시스템",
              layout: "feature-top",
              items: [
                { src: "/works/haemileum/system-tokens.webp", caption: "토큰 구조 (Figma Variables → JSON)", frame: "plain", fit: "contain" },
                { src: "/works/haemileum/system-variables.webp", caption: "Figma Variables · semantic.light" },
                { src: "/works/haemileum/system-components.webp", caption: "컴포넌트 가이드 · 입력 상태 · 모달 크기" },
                { src: "/works/haemileum/system-flow.webp", caption: "프로토타입 플로우" },
              ],
            },
          ],
        },
      },
      {
        id: "print",
        title: "홍보물 · 전시 디자인",
        period: "",
        role: "디자인",
        tools: "",
        summary: "회사와 발주처의 리플렛, 포스터, 전시 부스, 시즌·이벤트 이미지를 만들었습니다.",
        problem: "전시와 홍보 자리마다 UTM·UAM 사업을 짧은 시간 안에 설명할 인쇄물이 필요했습니다.",
        approach: "사업 소개, 핵심 기능, 실적을 한 장 안에서 나눠 보여 주고, 행사 성격에 맞춰 색과 이미지를 정했습니다.",
        result: "리플렛 2종, 포스터 2종, 전시 부스, 시즌·이벤트 이미지",
        panels: 2,
        images: {
          main: "/works/print/main.webp",
          ratio: 1800 / 668,
          frame: "plain",
          pages: [
            {
              title: "리플렛 · 포스터",
              layout: "row",
              items: [
                { src: "/works/print/leaflet-pal.webp", caption: "PAL Networks 리플렛", frame: "plain", fit: "contain" },
                { src: "/works/print/leaflet-kac.webp", caption: "KAC UTM 리플렛", frame: "plain", fit: "contain" },
                { src: "/works/print/poster-utm.webp", caption: "UTM/UATM 관제시스템 포스터", frame: "plain", fit: "contain" },
                { src: "/works/print/poster-kpav.webp", caption: "K-PAV 실증 플랫폼 포스터", frame: "plain", fit: "contain" },
              ],
            },
            {
              title: "전시 · 시즌 이미지",
              items: [{ src: "/works/print/collage.webp", caption: "전시 부스 · UTM 멤버십 이벤트 · 새해 인사 · 우주인재양성허브 배너", frame: "plain", fit: "contain" }],
            },
          ],
        },
      },
      {
        id: "freelance",
        title: "프리랜서 작업",
        period: "",
        role: "디자인 · AI 이미지 생성 후 보정",
        tools: "Photoshop, Illustrator, Figma, ChatGPT, Firefly, Freepik",
        summary: "쇼핑몰 상품 이미지부터 로고, 이벤트 포스터, 현수막까지 외주 디자인을 맡았습니다.",
        problem: "의뢰마다 온라인용·인쇄용으로 쓰임이 달랐습니다.",
        approach: "니트 상품은 AI로 모델컷을 생성한 뒤 색감·조명 톤을 보정해 색상 네 가지를 한 세트로 맞췄고, 로고·포스터·현수막은 의뢰처 업종에 맞춰 디자인했습니다.",
        result: "AI 상품컷 17장, 로고 2종, 이벤트 포스터, 현수막",
        panels: 1,
        images: {
          main: "/works/freelance/main.webp",
          ratio: 1,
          frame: "plain",
        },
        extras: [
          { src: "/works/freelance/logo-biz.webp", caption: "로고 · 비즈제작소" },
          { src: "/works/freelance/logo-jdeco.webp", caption: "로고 · JDECO" },
          { src: "/works/freelance/spoany-1.webp", caption: "헬스장 이벤트" },
          { src: "/works/freelance/spoany-2.webp", caption: "헬스장 이벤트" },
          { src: "/works/freelance/banner.webp", caption: "현수막" },
        ],
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
export type Panel = { kind: "cover" } | { kind: "work"; work: Work; index: number } | { kind: "detail"; work: Work; index: number; page: number };

export const panelsOf = (chapter: Chapter): Panel[] => {
  const list: Panel[] = [{ kind: "cover" }];
  chapter.works.forEach((work, index) => {
    list.push({ kind: "work", work, index });
    const pages = work.images?.pages;
    if (pages) pages.forEach((_, page) => list.push({ kind: "detail", work, index, page }));
    else if (work.panels === 2) list.push({ kind: "detail", work, index, page: 0 });
  });
  return list;
};

/** 목차·내비용 전체 이름 */
export const fullTitle = (w: Work) => (w.client ? `${w.client} · ${w.title}` : w.title);

/** 작업물이 시작하는 장 번호 */
export const workPanelIndex = (chapter: Chapter, workIndex: number) =>
  panelsOf(chapter).findIndex((p) => p.kind === "work" && p.index === workIndex);
