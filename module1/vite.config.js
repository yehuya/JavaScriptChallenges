import { defineConfig } from 'vite'
import { resolve } from 'path'
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
    server: {
        https: true
    },
    build: {
        rollupOptions: {
            input: {
                canvas: resolve(__dirname, 'src/canvas/index.html'),
                css: resolve(__dirname, 'src/css/index.html'),
            }
        }
    },
    plugins: [
        basicSsl()
    ]
})