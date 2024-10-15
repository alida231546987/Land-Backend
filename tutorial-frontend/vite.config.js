import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['js-big-decimal']
    },
  css: {
    preprocessorOptions: {
      css: {
        additionalData: `@import 'datatables.net-dt/css/jquery.dataTables.min.css';`
      }
    }
  }
});
