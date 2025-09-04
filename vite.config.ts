import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import { cloudflare } from "@cloudflare/vite-plugin"

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		vueDevTools(),
		cloudflare()
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			'@ftypes': fileURLToPath(new URL('./types', import.meta.url))
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					// Split large dependencies into separate chunks
					'pdf-viewer': ['pdf-vue3'],
					'media-players': ['aplayer', 'artplayer'],
					'markdown': ['markdown-it'],
					'vue-core': ['vue', 'vue-router']
				}
			}
		},
		// Increase chunk size warning limit
		chunkSizeWarningLimit: 1000
	}
})
