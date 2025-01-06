import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/", // Adjust this base path if your React app is deployed in a subdirectory.
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all requests to your backend
      "/api": {
        target: "http://localhost:10000", // The backend is running on port 10000
        changeOrigin: true,
        secure: false, // Set to true if your backend supports HTTPS
        rewrite: (path) => path.replace(/^\/api/, ""), // Rewrite '/api' if needed (if backend doesn't use '/api' prefix)
      },
      "/assets": {
        target: "http://localhost:10000", // Same backend for serving assets (static files)
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/assets/, "/assets"), // Proxy '/assets' to the correct static path
      },
    },
  },
});
