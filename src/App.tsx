import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "./lib/scroll";
import { initStepper } from "./lib/steps";
import "./styles/reset.css";
import "./styles/common.css";
import Intro from "./components/Intro/Intro";
import About from "./components/About/About";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle";
import SideNav from "./components/SideNav/SideNav";
import Chapter from "./components/Chapter/Chapter";
import Archive from "./components/Archive/Archive";
import Contact from "./components/Contact/Contact";
import Lightbox from "./components/Lightbox/Lightbox";
import Cursor from "./components/Cursor/Cursor";
import Sound from "./components/Sound/Sound";
import { CHAPTERS } from "./data/chapters";

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // 휠·키보드 한 번에 한 장씩 (데스크톱)
    const stopStepper = initStepper();
    // 모든 섹션이 붙은 뒤 위치 다시 계산
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      stopStepper();
      gsap.ticker.remove(raf);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="App">
      <ThemeToggle />
      <SideNav />
      <Intro />
      <About />
      {CHAPTERS.map((ch, i) => (
        <Chapter key={ch.id} chapter={ch} index={i} />
      ))}
      <Archive />
      <Contact />
      <Lightbox />
      <Sound />
      <Cursor />
    </div>
  );
}

export default App;
