import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/

import path from "path";

const srcPath = path.resolve(__dirname, './src');

export default defineConfig({
  plugins: [react()],
  resolvers: [{
    alias (id) {
      if (id.startsWith('@/')) {
        return path.join(srcPath, id.slice(2));
      }
    }
  }],
});