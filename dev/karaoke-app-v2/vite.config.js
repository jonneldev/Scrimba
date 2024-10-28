import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
        reserveRoom: 'reserveRoom.html',
        display: 'display.html',
        joinRoom: 'joinRoom.html',
        addSong: 'addSong.html',
      },
    },
  },
});
