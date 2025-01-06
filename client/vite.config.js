import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  target: "http://localhost:10000",
  base: "/",
  plugins: [react()],
});
