import config from '@ofk/eslint-config-recommend';

export default config({
  extends: [
    {
      files: ['app/{root,routes}.*', 'app/routes/**'],
      rules: {
        'react-refresh/only-export-components': 'off',
      },
    },
    {
      files: ['*.config.ts'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
  ],
  ignores: ['.react-router/', 'build/'],
  imports: {
    defaultExportFiles: ['app/{root,routes}.*', 'app/routes/**'],
  },
});
