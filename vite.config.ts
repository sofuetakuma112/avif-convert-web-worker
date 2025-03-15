import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  // WebAssemblyファイルを正しく扱うための設定
  optimizeDeps: {
    exclude: ['@jsquash/avif'],
  },
  build: {
    target: 'esnext',
    // WebAssemblyのバイナリを適切に処理
    rollupOptions: {
      output: {
        manualChunks: {
          jsquash: ['@jsquash/avif'],
        },
      },
    },
  },
});
