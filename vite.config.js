import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/

/** @type {{ lib?: boolean }} */
let libBuild = process.env.BUILD_LIB === 'true' || process.env.BUILD_LIB === '1'

export default defineConfig(() => {
  if (libBuild) {
    return {
      publicDir: false,
      plugins: [react(), tailwindcss()],
      build: {
        lib: {
          entry: 'src/components/DataTable/index.js',
          formats: ['es'],
          fileName: () => 'data-table.js',
        },
        rollupOptions: {
          external: ['react', 'react-dom', 'react/jsx-runtime', '@tanstack/react-table', '@tanstack/react-virtual'],
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

  /** Demo app — must not write to `dist/` (library build output). */
  return {
    plugins: [react(), tailwindcss()],
    build: {
      outDir: 'dist-demo',
      emptyOutDir: true,
    },
  }
})
