import { useEffect, useState } from "react";
import { setScrollLocked } from "../../lib/scroll";
import "./Enter.css";

// 첫 방문 인사 화면. "들어가기"를 누르는 순간이 브라우저의 소리 허락이 되어 배경 음악이 바로 시작됨
export const ENTER_EVENT = "site:enter";

function Enter() {
  const [state, setState] = useState<"open" | "leaving" | "gone">("open");

  useEffect(() => {
    window.scrollTo(0, 0);
    setScrollLocked(true);
    document.documentElement.classList.add("is-entering");
    return () => setScrollLocked(false);
  }, []);

  const enter = (sound: boolean) => {
    window.dispatchEvent(new CustomEvent("sound:set", { detail: sound }));
    setState("leaving");
    window.scrollTo(0, 0);
    setScrollLocked(false);
    document.documentElement.classList.remove("is-entering");
    window.dispatchEvent(new Event(ENTER_EVENT));
    window.setTimeout(() => setState("gone"), 900);
  };

  if (state === "gone") return null;
  return (
    <div className={`enter${state === "leaving" ? " is-leaving" : ""}`} role="dialog" aria-modal="true" aria-label="포트폴리오 들어가기">
      <div className="enter__inner">
        <p className="enter__label">Portfolio 2026</p>
        <h1 className="enter__name">Kim Jieun</h1>
        <p className="enter__thanks">방문해 주셔서 감사합니다.</p>
        <button type="button" className="enter__btn" onClick={() => enter(true)} autoFocus>
          <span>Enter</span>
          <i aria-hidden="true">→</i>
        </button>
        <button type="button" className="enter__quiet" onClick={() => enter(false)}>
          소리 없이 보기
        </button>
      </div>
      <p className="enter__hint">
        <span className="enter__bars" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        잔잔한 배경 음악과 함께 시작합니다
      </p>
    </div>
  );
}

export default Enter;
