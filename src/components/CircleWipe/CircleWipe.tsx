import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CHAPTERS } from "../../data/chapters";
import "./CircleWipe.css";

gsap.registerPlugin(ScrollTrigger);

// 챕터가 바뀔 때 다음 챕터 색의 원이 화면을 덮었다가 걷히는 전환
function CircleWipe() {
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const circle = circleRef.current!;
    const mm = gsap.matchMedia();

    const ease = gsap.parseEase("power2.inOut");

    mm.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.set(circle, { scale: 0 });
      const triggers = CHAPTERS.slice(1).map((ch) =>
        ScrollTrigger.create({
          trigger: `#${ch.id}`,
          start: "top bottom",
          end: "top top",
          onUpdate: (self) => {
            const p = self.progress;
            // 앞 절반: 커지며 덮음 / 뒤 절반: 작아지며 다음 챕터 표지를 드러냄
            const half = p < 0.5 ? p * 2 : (1 - p) * 2;
            circle.dataset.chapter = ch.id;
            gsap.set(circle, { scale: ease(half) * 1.8 });
          },
          onLeave: () => gsap.set(circle, { scale: 0 }),
          onLeaveBack: () => gsap.set(circle, { scale: 0 }),
        })
      );
      return () => triggers.forEach((t) => t.kill());
    });

    return () => mm.revert();
  }, []);

  return <div className="circle-wipe" ref={circleRef} aria-hidden="true" />;
}

export default CircleWipe;
