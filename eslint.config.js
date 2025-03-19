import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';

// Creëer een pre-configuratie voor React
const reactConfig = {
  plugins: { react: reactPlugin },
  rules: {
    ...reactPlugin.configs.recommended.rules,
    'react/prop-types': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  settings: {
    react: { version: 'detect' }
  }
};

// Import plugin configuratie
const importConfig = {
  plugins: { import: importPlugin },
  rules: {
    'import/no-unresolved': 'error',
    'import/named': 'error',
    'import/default': 'error',
    'import/namespace': 'error'
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
      }
    }
  }
};

export default [
  // Globale ignores
  { ignores: ['dist', 'node_modules', 'build'] },
  
  // Basisregels voor alle bestanden
  js.configs.recommended,
  
  // JavaScript en JSX bestanden
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    // React en gerelateerde plugins
    ...reactConfig,
    plugins: {
      ...reactConfig.plugins,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      import: importPlugin
    },
    rules: {
      ...reactConfig.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...importConfig.rules,
      'no-unused-vars': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
    settings: {
      ...reactConfig.settings,
      ...importConfig.settings
    }
  },
  
  // TypeScript bestanden - basisondersteuning
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Je kunt hier TypeScript-specifieke configuraties toevoegen als je TypeScript gebruikt
    ]
  }
];
