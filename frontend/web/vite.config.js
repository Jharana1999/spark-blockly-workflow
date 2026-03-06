import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(() => {
  const isGithubPages = process.env.GITHUB_PAGES === 'true'

  return {
    base: isGithubPages ? '/spark-blockly-workflow/' : '/',
    plugins: [react()],
  }
})
