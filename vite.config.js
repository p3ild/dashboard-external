import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    tailwindcss(), react(), vike()
  ],
  base: "/dashboard-niengiam/",
  publicDir: './public',
  server: { allowedHosts: true }
})