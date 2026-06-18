import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin/index.html'),
      },
    },
  },
  server: {
    port: 5173,
    allowedHosts: true
  },
  plugins: [
    {
      name: 'spa-fallback',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const url = req.url?.split('?')[0] ?? ''
          if (url === '/framefix' || url === '/frameselect') req.url = '/index.html'
          next()
        })
      },
    },
  ],
})
