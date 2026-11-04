import { useState } from "react";
import { scrollToY } from "../../lib/scroll";
import "./Contact.css";
import { EMAIL } from "../../data/profile";


// 마지막 섹션 — 메일 앱 바로 열기 + 주소 복사, 처음으로 돌아가는 버튼
function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const t = document.createElement("textarea");
      t.value = EMAIL;
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="contact" id="contact" data-stop>
      <p className="contact__label">Contact</p>
      <h2 className="contact__title">함께 일할 기회를 기다립니다.</h2>
      <p className="contact__desc">포트폴리오를 봐 주셔서 감사합니다. 궁금한 점은 메일로 편하게 연락 주세요.</p>

      <div className="contact__mail">
        <a className="contact__address" href={`mailto:${EMAIL}?subject=${encodeURIComponent("[포트폴리오] 김지은 님께 문의드립니다")}`}>
          {EMAIL}
        </a>
        <div className="contact__actions">
          <a className="contact__btn contact__btn--primary" href={`mailto:${EMAIL}?subject=${encodeURIComponent("[포트폴리오] 김지은 님께 문의드립니다")}`}>
            메일 보내기 <span aria-hidden="true">↗</span>
          </a>
          <button type="button" className="contact__btn" onClick={copy} aria-live="polite">
            {copied ? "복사했습니다 ✓" : "주소 복사"}
          </button>
        </div>
      </div>

      <button type="button" className="contact__top" onClick={() => scrollToY(0, { duration: 2 })}>
        <span aria-hidden="true">↑</span> 처음으로
      </button>
    </section>
  );
}

export default Contact;
