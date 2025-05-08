import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  // Ignore the `dist` directory (Vite's build output)
  { ignores: ['dist'] },

  // Configuration for JS and JSX files
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest', // Use the latest ECMAScript version
        ecmaFeatures: { jsx: true }, // Enable JSX parsing
        sourceType: 'module', // Support ES modules
      },
    },
    plugins: {
      react, // React-specific linting
      'react-hooks': reactHooks, // React Hooks rules
      'react-refresh': reactRefresh, // Vite React Refresh support
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect React version
      },
    },
    rules: {
      // Combine recommended rules from ESLint, React, and React Hooks
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // Custom rules
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }], // Allow unused vars starting with uppercase or underscore
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ], // Ensure components are exported for React Refresh
      'react/prop-types': 'off', // Disable prop-types (optional, enable if using PropTypes)
    },
  },
];