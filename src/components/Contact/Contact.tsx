import { scrollToY } from "../../lib/scroll";
import "./Contact.css";

// 마지막 섹션 — 연락처는 작성 예정, 처음으로 돌아가는 버튼
function Contact() {
  return (
    <section className="contact" id="contact" data-stop>
      <p className="contact__label">Contact</p>
      <h2 className="contact__title">함께 일할 기회를 기다립니다.</h2>
      <p className="contact__desc">연락처 작성 예정</p>
      <button type="button" className="contact__top" onClick={() => scrollToY(0, { duration: 2 })}>
        <span aria-hidden="true">↑</span> 처음으로
      </button>
    </section>
  );
}

export default Contact;
