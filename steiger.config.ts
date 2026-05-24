import { defineConfig } from 'steiger'
import fsd from '@feature-sliced/steiger-plugin'

export default defineConfig([
  ...fsd.configs.recommended,

  {
    ignores: [
      'src/app/**',
      'src/app/**/.*',
      'src/app-init/**',
      'src/app-init/**/.*',
      '**/__mocks__/**',
      '**/node_modules/**',
    ],
  },

  {
    files: ['src/shared/**', 'src/shared/**/.*', 'src/shared/.*'],
    rules: {
      'fsd/public-api': 'off',
      'fsd/segments-by-purpose': 'off',
    },
  },

  {
    rules: {
      'fsd/insignificant-slice': 'warn',
    },
  },
])
