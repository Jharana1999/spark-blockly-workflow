import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(() => {
  const isGithubPages = process.env.GITHUB_PAGES === 'true'
  const repoName = process.env.GITHUB_REPOSITORY?.split('/')?.[1]

  return {
    base: isGithubPages && repoName ? `/${repoName}/` : '/',
    plugins: [react()],
  }
})
