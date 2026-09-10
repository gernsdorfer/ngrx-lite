const angular = require('angular-eslint');
const nxEslintPlugin = require('@nx/eslint-plugin');
const baseConfig = require('../../eslint.config.js');

module.exports = [
  ...baseConfig,
  { files: ['**/*.ts'], processor: angular.processInlineTemplates },
  ...nxEslintPlugin.configs['flat/angular'].map((config) => ({
    ...config,
    files: ['**/*.ts'],
    rules: {
      ...config.rules,
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'todo',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'todo',
          style: 'kebab-case',
        },
      ],
    },
  })),
  ...nxEslintPlugin.configs['flat/angular-template'].map((config) => ({
    ...config,
    files: ['**/*.html'],
    rules: {
      ...config.rules,
    },
  })),
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/prefer-standalone': 'off',
      // Newly enabled by the angular-eslint v22 recommended set. The Angular 22
      // migration kept these components on the pre-v22 default change detection
      // (ChangeDetectionStrategy.Eager); moving them to OnPush is a separate change.
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
    },
  },
];
