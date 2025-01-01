import { defineConfig } from 'vite'
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
    server: {
        https: false,
        open: "./index.html"
    },
    plugins: [
        basicSsl()
    ]
})