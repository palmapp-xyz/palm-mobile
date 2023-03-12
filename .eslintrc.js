module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
      },
    },
  ],
  rules: {
    'react-hooks/exhaustive-deps': 'off',
    'no-spaced-func': 'off',
    'react-native/no-inline-styles': 'off',
    'prettier/prettier': [
      'error',
      {
        'no-inline-styles': false,
        'no-spaced-func': false,
      },
    ],
    semi: 'off',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
  },
}
