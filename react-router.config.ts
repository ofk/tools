/* eslint-disable import/no-nodejs-modules */
import type { Config } from '@react-router/dev/config';

import { copyFileSync } from 'node:fs';
import path from 'node:path';

import pkg from './package.json';

export default {
  basename: import.meta.env.PROD ? `/${pkg.name}/` : '/',
  buildEnd(args): void {
    if (!args.viteConfig.isProduction) return;
    const buildPath = args.viteConfig.build.outDir;
    copyFileSync(path.join(buildPath, 'index.html'), path.join(buildPath, '404.html'));
  },
  ssr: false,
} satisfies Config;
