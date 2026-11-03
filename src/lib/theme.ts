export type Theme = "light" | "dark";

const KEY = "theme";
const media = () => window.matchMedia("(prefers-color-scheme: dark)");

export const getTheme = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

const readSaved = (): Theme | null => {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
};

const apply = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
  window.dispatchEvent(new CustomEvent<Theme>("themechange", { detail: theme }));
};

// 사용자가 직접 바꾼 경우: 저장해서 다음 방문에도 유지
export const setTheme = (theme: Theme) => {
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* 저장 불가 환경은 이번 방문에만 적용 */
  }
  apply(theme);
};

// 직접 고른 적이 없으면 시스템 설정 변경을 그대로 따라감
export const watchSystemTheme = () => {
  const mq = media();
  const onChange = () => {
    if (!readSaved()) apply(mq.matches ? "dark" : "light");
  };
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
