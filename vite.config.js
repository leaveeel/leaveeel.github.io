import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression'
import viteImagemin from 'vite-plugin-imagemin'

export default () => {
  return defineConfig({
    base: '/',
    build: {
      assetsInlineLimit: 4096,
      cssCodeSplit: true,
      outDir: 'docs',
      rollupOptions: {
        output: {
          manualChunks: id => {
            if (id.includes('node_modules')) {
              if (id.includes('zc-ui-component')) {
                return 'zc-ui'
              }
              return 'vendor'
            }
          }
        }
      },
      target: ['esnext']
    },
    plugins: [
      vue(),
      viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 10240,
        deleteOriginFile: false,
        filter: /\.(js|css)$/i,
        compressionOptions: {
          level: 9
        }
      }),
      viteImagemin({
        gifsicle: { optimizationLevel: 7, interlaced: false },
        optipng: { optimizationLevel: 7 },
        mozjpeg: { quality: 70 },
        pngquant: { quality: [0.7, 0.8], speed: 4 },
        webp: { quality: 70 }
      }),
      AutoImport({
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
        imports: [
          'vue',
          'vue-router',
          'pinia',
          {
            '@vueuse/core': ['useMouse', ['useFetch', 'useMyFetch']],
            'zc-ui-component': [
              'zcButton',
              'zcButtonGroup',
              'zcCard',
              'zcCheckbox',
              'zcCheckboxGroup',
              'zcDialog',
              'zcForm',
              'zcFormItem',
              'zcInput',
              'zcIcon',
              'zcImage',
              'zcPagination',
              'zcScroll',
              'zcSkeleton',
              'zcSkeletonItem',
              'zcTable',
              'zcTooltip',
              'zcToast',
              'zcMessage',
              'zcLoading'
            ],
            '[packagename]': ['[importnames]', ['[from]', '[alias]']]
          }
        ],
        dts: './auto-imports.d.ts',
        vueTemplate: false,
        eslintrc: {
          enabled: false,
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true
        }
      }),
      Components({ resolvers: [] })
    ].filter(Boolean),
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
    },
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
      jsxInject: "import { h } from 'vue';"
    },
    css: {
      preprocessorOptions: { requireModuleExtension: true }
    }
  })
}
