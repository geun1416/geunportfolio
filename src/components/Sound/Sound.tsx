import { useEffect, useRef, useState } from "react";
import "./Sound.css";

// 배경 음악 켜기/끄기. 브라우저 정책상 자동 재생은 하지 않고, 누르면 천천히 커지며 시작
const KEY = "bgm";
const MAX = 0.32;

function Sound() {
  const audio = useRef<HTMLAudioElement | null>(null);
  const fade = useRef(0);
  const [on, setOn] = useState(false);

  const ramp = (to: number, done?: () => void) => {
    const a = audio.current!;
    window.clearInterval(fade.current);
    fade.current = window.setInterval(() => {
      const v = a.volume + (to > a.volume ? 0.02 : -0.03);
      if ((to > a.volume && v >= to) || (to <= a.volume && v <= to)) {
        a.volume = Math.max(0, Math.min(1, to));
        window.clearInterval(fade.current);
        done?.();
      } else a.volume = Math.max(0, Math.min(1, v));
    }, 60);
  };

  const toggle = () => {
    if (!audio.current) {
      audio.current = new Audio("/audio/bgm.mp3");
      audio.current.loop = true;
      audio.current.volume = 0;
    }
    const a = audio.current;
    if (on) {
      ramp(0, () => a.pause());
      setOn(false);
      try { localStorage.setItem(KEY, "off"); } catch { /* 저장 불가 환경 */ }
    } else {
      a.play().then(() => ramp(MAX)).catch(() => setOn(false));
      setOn(true);
      try { localStorage.setItem(KEY, "on"); } catch { /* 저장 불가 환경 */ }
    }
  };

  // 다른 탭으로 가면 잠시 멈춤
  useEffect(() => {
    const vis = () => {
      const a = audio.current;
      if (!a || !on) return;
      if (document.hidden) a.pause();
      else a.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", vis);
    return () => document.removeEventListener("visibilitychange", vis);
  }, [on]);

  return (
    <button type="button" className={`sound${on ? " is-on" : ""}`} onClick={toggle} aria-pressed={on} aria-label={on ? "배경 음악 끄기" : "배경 음악 켜기"}>
      <span className="sound__bars" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="sound__text">{on ? "Sound on" : "Sound off"}</span>
    </button>
  );
}

export default Sound;
