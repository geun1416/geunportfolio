// PDF 만들기: npm run build 후 npm run pdf (기본) / npm run pdf -- commerce (이미지·프로모션 먼저인 버전)
// vite preview로 pdf.html을 띄워 A4 가로로 인쇄 → portfolio-pdf/ 폴더
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const PORT = 4321;
const variant = process.argv[2]; // 예: commerce
const file = variant === "commerce" ? "김지은_포트폴리오_커머스.pdf" : "김지은_포트폴리오.pdf";
const server = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], { stdio: "ignore", shell: true });
await new Promise((r) => setTimeout(r, 2500));

try {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  await page.goto(`http://localhost:${PORT}/pdf.html${variant ? `?v=${variant}` : ""}`, { waitUntil: "networkidle" });
  // 이미지와 글꼴이 모두 그려질 때까지 대기
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => (i.onload = i.onerror = r)))));
  });
  mkdirSync("portfolio-pdf", { recursive: true });
  await page.pdf({ path: `portfolio-pdf/${file}`, width: "297mm", height: "210mm", printBackground: true, preferCSSPageSize: true });
  await browser.close();
  console.log(`portfolio-pdf/${file} 생성 완료`);
} finally {
  server.kill();
}
