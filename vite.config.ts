import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import pkg from './package.json';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? `/${pkg.name}/` : undefined,
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  resolve: {
    alias: {
      // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
      // cf. https://github.com/tabler/tabler-icons/issues/1233#issuecomment-2428245119
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
}));
