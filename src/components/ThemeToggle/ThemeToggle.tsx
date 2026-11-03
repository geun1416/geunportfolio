import { useEffect, useState } from "react";
import { getTheme, setTheme, watchSystemTheme, type Theme } from "../../lib/theme";
import "./ThemeToggle.css";

function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>(getTheme);

  useEffect(() => {
    const onTheme = (e: Event) => setThemeState((e as CustomEvent<Theme>).detail);
    window.addEventListener("themechange", onTheme);
    const unwatch = watchSystemTheme();
    return () => {
      window.removeEventListener("themechange", onTheme);
      unwatch();
    };
  }, []);

  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button type="button" className="theme-toggle" onClick={() => setTheme(next)} aria-label={`${next === "dark" ? "다크" : "라이트"} 모드로 전환`}>
      <span className={`theme-toggle__opt${theme === "light" ? " is-active" : ""}`}>Light</span>
      <span className="theme-toggle__sep">/</span>
      <span className={`theme-toggle__opt${theme === "dark" ? " is-active" : ""}`}>Dark</span>
    </button>
  );
}

export default ThemeToggle;
