import { useEffect, useRef } from "react";
import "./Cursor.css";

// 마우스 포인터: 작은 점 + 천천히 따라오는 부드러운 원. 누를 수 있는 곳에서는 원이 커짐
function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine.matches) return;
    document.documentElement.classList.add("has-cursor");

    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      dot.current!.style.transform = `translate(${x}px, ${y}px)`;
      const t = e.target as HTMLElement;
      const hot = !!t.closest("a, button, [role='button'], .tile, .compare, input, label");
      ring.current!.classList.toggle("is-hot", hot);
      document.documentElement.classList.remove("cursor-out");
    };
    const tick = () => {
      rx += (x - rx) * (reduce ? 1 : 0.16);
      ry += (y - ry) * (reduce ? 1 : 0.16);
      ring.current!.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(tick);
    };
    const down = () => ring.current!.classList.add("is-down");
    const up = () => ring.current!.classList.remove("is-down");
    const leave = () => document.documentElement.classList.add("cursor-out");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("mouseleave", leave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("mouseleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <div className="cursor__ring" ref={ring}>
        <span />
      </div>
      <div className="cursor__dot" ref={dot}>
        <span />
      </div>
    </div>
  );
}

export default Cursor;
