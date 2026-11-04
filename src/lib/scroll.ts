import type Lenis from "lenis";

let instance: Lenis | null = null;

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis;
};

export const scrollToY = (y: number, opts: { duration?: number; onComplete?: () => void } = {}) => {
  const { duration = 1.4, onComplete } = opts;
  if (instance) {
    instance.scrollTo(y, { duration, lock: true, onComplete: () => onComplete?.() });
  } else {
    window.scrollTo({ top: y, behavior: "smooth" });
    if (onComplete) window.setTimeout(onComplete, duration * 1000);
  }
};

/** 크게 보기 등 오버레이가 열린 동안 페이지 스크롤 멈춤 */
export const setScrollLocked = (locked: boolean) => {
  if (instance) (locked ? instance.stop() : instance.start());
  document.documentElement.style.overflow = locked ? "hidden" : "";
};
