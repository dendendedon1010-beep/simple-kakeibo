import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repositoryName = 'simple-kakeibo';
const isUserOrOrgPages = repositoryName.endsWith('.github.io');

export default defineConfig({
  plugins: [react()],
  base: isUserOrOrgPages ? '/' : `/${repositoryName}/`,
});
