import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';

const packageInfo = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
let commit = process.env.NEOTIEBA_BUILD_COMMIT || '';
if (!commit) { try { commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(); } catch {} }
const builtAt = process.env.NEOTIEBA_BUILD_TIME || new Date().toISOString();
const host = process.env.TAURI_DEV_HOST;
export default defineConfig(async () => ({
  define: { __APP_VERSION__: JSON.stringify(packageInfo.version), __BUILD_TIME__: JSON.stringify(builtAt), __BUILD_COMMIT__: JSON.stringify(commit) },
  plugins: [
    vue(),
    // 组件自动导入
    Components({
      // 扫描整个 components 目录，包含子目录，生成类型声明
      dirs: ['src/components'],
      extensions: ['vue'],
      deep: true,
      dts: 'src/components.d.ts',
      resolvers: [],
    }),
    // API自动导入
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: 'src/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
      },
    }),
  ],
  clearScreen: false,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "#components": path.resolve(__dirname, "./src/components"),
    },
  },
  server: {
    port: 1143,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
        protocol: "ws",
        host,
        port: 1143,
      }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },

  build: {
    rollupOptions: {
    }
  }
}));
