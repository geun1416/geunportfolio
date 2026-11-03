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
  const contact = document.getElementById("contact");
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (contact) stops.push(Math.min(contact.getBoundingClientRect().top + window.scrollY, max));
  return [...new Set(stops.map((v) => Math.round(v)))].sort((a, b) => a - b);
};

export const initStepper = () => {
  const desktop = window.matchMedia("(min-width: 769px)");
  let locked = false;
  let cooldownUntil = 0;

  const step = (dir: 1 | -1) => {
    const y = window.scrollY;
    const stops = allStops();
    const target = dir > 0 ? stops.find((v) => v > y + 2) : [...stops].reverse().find((v) => v < y - 2);
    if (target === undefined) return false;
    locked = true;
    scrollToY(target, {
      duration: 1.1,
      onComplete: () => {
        locked = false;
        cooldownUntil = performance.now() + 450; // 트랙패드 관성 스크롤 흡수
      },
    });
    return true;
  };

  const consume = (e: Event) => {
    e.preventDefault();
    e.stopImmediatePropagation();
  };

  const onWheel = (e: WheelEvent) => {
    if (!desktop.matches || e.ctrlKey) return; // 모바일·확대(ctrl+휠)는 그대로
    const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(delta) < 2) return consume(e);
    if (locked || performance.now() < cooldownUntil) return consume(e);
    if (step(delta > 0 ? 1 : -1)) consume(e);
  };

  const onKey = (e: KeyboardEvent) => {
    if (!desktop.matches) return;
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
