import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Digimon artwork is served same-origin (/digi-img/...) so the browser can read its pixels and cut out the
// white background. On Vercel this is a rewrite (vercel.json); locally it is this proxy.
const digiProxy = {
  target: "https://digi-api.com",
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/digi-img/, "/images/digimon/w"),
};

export default defineConfig({
  plugins: [react()],
  server: { proxy: { "/digi-img": digiProxy } },
  preview: { proxy: { "/digi-img": digiProxy } },
});
