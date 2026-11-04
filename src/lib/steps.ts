import { scrollToY } from "./scroll";

// 페이지 전체의 "멈춤 지점"을 모아 휠·키보드 한 번에 한 장씩 이동
// 각 챕터가 자기 장 위치를 등록하고, 인트로(0)와 Contact는 고정 지점

type Provider = () => number[];
const providers = new Map<string, Provider>();

export const registerStops = (key: string, provider: Provider) => {
  providers.set(key, provider);
  return () => providers.delete(key);
};

const allStops = () => {
  const stops = [0];
  providers.forEach((p) => stops.push(...p()));
  // 챕터 뒤의 일반 섹션(Archive, Contact)은 위쪽 끝을 멈춤 지점으로
  const max = document.documentElement.scrollHeight - window.innerHeight;
  document.querySelectorAll<HTMLElement>("[data-stop]").forEach((el) => {
    stops.push(Math.min(el.getBoundingClientRect().top + window.scrollY, max));
  });
  return [...new Set(stops.map((v) => Math.round(v)))].sort((a, b) => a - b);
};

export const initStepper = () => {
  const desktop = window.matchMedia("(min-width: 769px)");
  let locked = false;
  let cooldownUntil = 0;
  let lastWheel = 0;
  let safety = 0;

  const unlock = () => {
    window.clearTimeout(safety);
    if (!locked) return;
    locked = false;
    cooldownUntil = performance.now() + 350; // 트랙패드 관성 스크롤 흡수
  };

  const step = (dir: 1 | -1) => {
    const y = window.scrollY;
    const stops = allStops();
    const target = dir > 0 ? stops.find((v) => v > y + 2) : [...stops].reverse().find((v) => v < y - 2);
    if (target === undefined) return false;
    locked = true;
    // 애니메이션 완료 신호가 오지 않는 경우에도 잠김이 풀리도록 안전장치
    safety = window.setTimeout(unlock, 1500);
    scrollToY(target, { duration: 1.1, onComplete: unlock });
    return true;
  };

  const consume = (e: Event) => {
    e.preventDefault();
    e.stopImmediatePropagation();
  };

  const onWheel = (e: WheelEvent) => {
    if (document.documentElement.classList.contains("lb-open")) return consume(e); // 크게 보기 중에는 이동하지 않음
    if (!desktop.matches || e.ctrlKey) return; // 모바일·확대(ctrl+휠)는 그대로
    const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    const now = performance.now();
    const newGesture = now - lastWheel > 180; // 잠깐 멈췄다가 다시 굴리면 새 동작으로 봄 (마우스 휠)
    lastWheel = now;
    if (Math.abs(delta) < 2) return consume(e);
    if (locked || (now < cooldownUntil && !newGesture)) return consume(e);
    if (step(delta > 0 ? 1 : -1)) consume(e);
  };

  const onKey = (e: KeyboardEvent) => {
    if (!desktop.matches || document.documentElement.classList.contains("lb-open")) return;
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    const next = ["ArrowDown", "ArrowRight", "PageDown"].includes(e.key) || (e.key === " " && !e.shiftKey);
    const prev = ["ArrowUp", "ArrowLeft", "PageUp"].includes(e.key) || (e.key === " " && e.shiftKey);
    if (!next && !prev) return;
    if (locked) return consume(e);
    if (step(next ? 1 : -1)) consume(e);
  };

  window.addEventListener("wheel", onWheel, { passive: false, capture: true });
  window.addEventListener("keydown", onKey, { capture: true });
  return () => {
    window.removeEventListener("wheel", onWheel, { capture: true });
    window.removeEventListener("keydown", onKey, { capture: true });
  };
};
