import {defineConfig} from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
	base: "/", // Required for Netlify routing
	plugins: [
		react()
	]
})

