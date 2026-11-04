import { createRoot } from "react-dom/client";
import PdfDoc from "./PdfDoc";

// PDF 전용 페이지 (A4 가로). scripts/make-pdf.mjs가 이 화면을 인쇄해 PDF로 만듦
createRoot(document.getElementById("root")!).render(<PdfDoc />);
