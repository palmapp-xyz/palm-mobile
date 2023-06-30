// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
module.exports = function (api) {
  api.cache(true)

  const moduleResolver = [
    'module-resolver',
    {
      root: './',
      alias: {
        'core/libs': './src/core/libs',
        'core/store': './src/core/store',
        'core/types': './src/core/types',
        'core/consts': './src/core/consts',
        'core/graphqls': './src/core/graphqls',
        assets: './src/assets',
        config: './src/config',
        components: './src/components',
        hooks: './src/hooks',
      },
    },
  ]

  const plugins = [
    moduleResolver,
    [
      'react-native-reanimated/plugin',
      {
        relativeSourceLocation: true,
      },
    ],
  ]

  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins,
  }
}
