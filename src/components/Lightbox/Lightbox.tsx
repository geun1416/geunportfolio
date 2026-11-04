import { useEffect, useState } from "react";
import { setScrollLocked } from "../../lib/scroll";
import "./Lightbox.css";

// 상세 이미지를 눌렀을 때 화면 가득 전체 이미지를 보여 줌
type Item = { src: string; caption: string };

export const openLightbox = (src: string, caption: string) =>
  window.dispatchEvent(new CustomEvent<Item>("lightbox:open", { detail: { src, caption } }));

function Lightbox() {
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => setItem((e as CustomEvent<Item>).detail);
    window.addEventListener("lightbox:open", onOpen);
    return () => window.removeEventListener("lightbox:open", onOpen);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("lb-open", !!item);
    setScrollLocked(!!item);
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setItem(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item]);

  if (!item) return null;
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.caption} onClick={() => setItem(null)}>
      <figure className="lightbox__fig" onClick={(e) => e.stopPropagation()}>
        <img src={item.src} alt={item.caption} />
        <figcaption>{item.caption}</figcaption>
      </figure>
      <button type="button" className="lightbox__close" onClick={() => setItem(null)} aria-label="닫기">
        ×
      </button>
    </div>
  );
}

export default Lightbox;
