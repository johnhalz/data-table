import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/

/** @type {{ lib?: boolean }} */
let libBuild = process.env.BUILD_LIB === 'true' || process.env.BUILD_LIB === '1'

export default defineConfig(() => {
  if (libBuild) {
    return {
      publicDir: false,
      plugins: [vue(), tailwindcss()],
      build: {
        lib: {
          entry: 'src/components/DataTable/index.js',
          formats: ['es'],
          fileName: () => 'data-table.js',
        },
        rollupOptions: {
          external: ['vue', '@tanstack/vue-table', '@tanstack/vue-virtual', '@vueuse/core'],
          output: {
            entryFileNames: 'data-table.js',
            assetFileNames: 'data-table.[ext]',
          },
        },
        cssCodeSplit: false,
        emptyOutDir: true,
        outDir: 'dist',
      },
    }
  }

  return {
    plugins: [vue(), tailwindcss()],
  }
})
