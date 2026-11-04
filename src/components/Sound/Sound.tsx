import { useEffect, useRef, useState } from "react";
import "./Sound.css";

// 배경 음악: 기본값은 켜짐. 브라우저가 소리 있는 자동 재생을 막으면 첫 클릭·키 입력 때 시작
// 사용자가 끈 경우에는 그 선택을 기억해 다음 방문에도 꺼진 상태로 시작
const KEY = "bgm";
const MAX = 0.32;

function Sound() {
  const audio = useRef<HTMLAudioElement | null>(null);
  const fade = useRef(0);
  const [on, setOn] = useState(() => {
    try {
      return localStorage.getItem(KEY) !== "off";
    } catch {
      return true;
    }
  });
  const [playing, setPlaying] = useState(false);

  const get = () => {
    if (!audio.current) {
      audio.current = new Audio("/audio/bgm.mp3");
      audio.current.loop = true;
      audio.current.volume = 0;
    }
    return audio.current;
  };

  const ramp = (to: number, done?: () => void) => {
    const a = get();
    window.clearInterval(fade.current);
    fade.current = window.setInterval(() => {
      const up = to > a.volume;
      const v = a.volume + (up ? 0.015 : -0.03);
      if ((up && v >= to) || (!up && v <= to)) {
        a.volume = Math.max(0, Math.min(1, to));
        window.clearInterval(fade.current);
        done?.();
      } else a.volume = Math.max(0, Math.min(1, v));
    }, 60);
  };

  const start = () =>
    get()
      .play()
      .then(() => {
        setPlaying(true);
        ramp(MAX);
        return true;
      })
      .catch(() => false);

  // 인사 화면에서 고른 값(소리 켜기/끄기)을 받음 — 버튼 클릭 안에서 실행되어 재생이 허용됨
  useEffect(() => {
    const onSet = (e: Event) => {
      const want = (e as CustomEvent<boolean>).detail;
      setOn(want);
      try { localStorage.setItem(KEY, want ? "on" : "off"); } catch { /* 저장 불가 환경 */ }
      if (want) start();
    };
    window.addEventListener("sound:set", onSet);
    return () => window.removeEventListener("sound:set", onSet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 인사 화면이 없을 때를 위한 대비: 켜짐 상태면 재생을 시도하고, 막히면 첫 상호작용을 기다림
  useEffect(() => {
    if (!on || document.documentElement.classList.contains("is-entering")) return;
    let cleanup = () => {};
    start().then((ok) => {
      if (ok) return;
      const unlock = (e: Event) => {
        if ((e.target as HTMLElement)?.closest?.(".sound")) return; // 버튼 자체 클릭은 toggle이 처리
        start();
        cleanup();
      };
      const evs = ["pointerdown", "keydown", "touchstart"];
      evs.forEach((ev) => window.addEventListener(ev, unlock, { once: true, capture: true }));
      cleanup = () => evs.forEach((ev) => window.removeEventListener(ev, unlock, { capture: true }));
    });
    return () => cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    const a = get();
    if (on && playing) {
      ramp(0, () => a.pause());
      setOn(false);
      setPlaying(false);
      try { localStorage.setItem(KEY, "off"); } catch { /* 저장 불가 환경 */ }
    } else {
      setOn(true);
      start();
      try { localStorage.setItem(KEY, "on"); } catch { /* 저장 불가 환경 */ }
    }
  };

  // 다른 탭으로 가면 잠시 멈춤
  useEffect(() => {
    const vis = () => {
      const a = audio.current;
      if (!a || !playing) return;
      if (document.hidden) a.pause();
      else a.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", vis);
    return () => document.removeEventListener("visibilitychange", vis);
  }, [playing]);

  const active = on && playing;
  return (
    <button type="button" className={`sound${active ? " is-on" : ""}`} onClick={toggle} aria-pressed={active} aria-label={active ? "배경 음악 끄기" : "배경 음악 켜기"}>
      <span className="sound__bars" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="sound__text">{active ? "Sound on" : "Sound off"}</span>
    </button>
  );
}

export default Sound;
