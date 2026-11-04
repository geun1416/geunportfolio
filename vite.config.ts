import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  server: { port: 3002, open: true },
  // index.html = 웹 포트폴리오, pdf.html = PDF로 인쇄하는 화면
  build: { rollupOptions: { input: { main: resolve(__dirname, "index.html"), pdf: resolve(__dirname, "pdf.html") } } },
});
