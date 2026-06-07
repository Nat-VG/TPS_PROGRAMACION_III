import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "src/pages/auth/login/login.html"),
        registro: resolve(__dirname, "src/pages/auth/registro/registro.html"),
        admin: resolve(__dirname, "src/pages/admin/admin.html"),
        client: resolve(__dirname, "src/pages/client/client.html"),
      },
    },
  },
});
