import { defineConfig } from 'vite';

export default defineConfig({
  root: '.', // Set the root to the current directory (where main.html is located)
  build: {
    outDir: 'dist', // Output directory for the production build
    rollupOptions: {
      input: './main.html', // Specify your main HTML file directly
    },
  },
});
