import { useRef, useState } from "react";
import "./Media.css";

type Props = { before: string; after: string; alt: string };

// 가운데 막대를 끌어서 전·후 비교 (키보드 ← → 도 가능)
function Compare({ before, after, alt }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);

  const moveTo = (clientX: number) => {
    const r = boxRef.current!.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div
      className={`compare${dragging ? " is-dragging" : ""}`}
      ref={boxRef}
      onPointerDown={(e) => {
        setDragging(true);
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        moveTo(e.clientX);
      }}
      onPointerMove={(e) => dragging && moveTo(e.clientX)}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
    >
      <img src={after} alt={`${alt} 개편 후`} draggable={false} loading="lazy" decoding="async" />
      <img className="compare__before" src={before} alt={`${alt} 개편 전`} draggable={false} loading="lazy" decoding="async" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
      <span className="compare__tag compare__tag--before">Before</span>
      <span className="compare__tag compare__tag--after">After</span>
      <button
        type="button"
        className="compare__handle"
        style={{ left: `${pos}%` }}
        role="slider"
        aria-label="전·후 비교"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            e.stopPropagation();
            setPos((v) => Math.min(100, Math.max(0, v + (e.key === "ArrowRight" ? 5 : -5))));
          }
        }}
      >
        <span aria-hidden="true">‹ ›</span>
      </button>
    </div>
  );
}

export default Compare;
