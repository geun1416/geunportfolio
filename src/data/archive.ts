// 2019–2025 이전 작업 — 연도별 한 줄 목록 (썸네일은 원본 코드에서 다시 띄워 캡처)
export type ArchiveItem = {
  year: string;
  title: string;
  client?: string;
  type: "Web" | "Mobile Web" | "App";
  role: string[];
  thumb?: string;
  device?: "desktop" | "mobile";
};

export const ARCHIVE: ArchiveItem[] = [
  { year: "2024", title: "항공교통데이터포털 통계분석 시스템", client: "국토교통부", type: "Web", role: ["퍼블리싱"], thumb: "atfm-stats", device: "desktop" },
  { year: "2023", title: "항공권 예약 엔진(IBE)", client: "섬에어", type: "Web", role: ["퍼블리싱"] },
  { year: "2022", title: "군 감항인증 교육과정 홈페이지", type: "Web", role: ["퍼블리싱"] },
  { year: "2021–", title: "위치 공유 앱 '날봐'", client: "사내 프로젝트", type: "App", role: ["디자인", "퍼블리싱"], thumb: "nalbwa", device: "mobile" },
  { year: "2021", title: "청소년 SW 경진대회 메타버스", client: "KB국민은행", type: "Web", role: ["기획", "디자인", "퍼블리싱"], thumb: "kbsc", device: "desktop" },
  { year: "2021", title: "항공권 예약 OTA '캐플릭스'", client: "제주패스", type: "Mobile Web", role: ["퍼블리싱"], thumb: "capflix", device: "desktop" },
  { year: "2020", title: "방역 QR 출입관리 모바일웹", client: "인천관광공사", type: "Mobile Web", role: ["기획", "디자인", "퍼블리싱"], thumb: "incheon", device: "mobile" },
  { year: "2020", title: "QR 출입 인증 시스템", client: "현대자동차", type: "Mobile Web", role: ["기획", "디자인", "퍼블리싱"] },
  { year: "2019–20", title: "항공사 홈페이지 · 모바일", client: "하이에어", type: "Mobile Web", role: ["퍼블리싱"], thumb: "hiair", device: "mobile" },
  { year: "2019", title: "회사 홈페이지 (이전 버전)", client: "PAL Networks", type: "Web", role: ["기획", "디자인", "퍼블리싱"], thumb: "pal-old", device: "desktop" },
];
