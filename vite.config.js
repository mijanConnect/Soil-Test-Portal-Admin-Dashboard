import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    // host: "10.10.7.46",
    // host: "193.46.198.251",
    host: "0.0.0.0",
    port: 3001,
  },
});
