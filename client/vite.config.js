import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  "/api": {
    target: "http://image-resize-5uqz.onrender.com",
    changeOrigin: true,
    secure: false,
  },
});
