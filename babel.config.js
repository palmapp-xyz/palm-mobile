// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
module.exports = function (api) {
  api.cache(true)

  const moduleResolver = [
    'module-resolver',
    {
      root: './',
      alias: {
        libs: './src/core/libs',
        hooks: './src/hooks',
        store: './src/store',
        assets: './src/assets',
        types: './src/core/types',
        consts: './src/core/consts',
        components: './src/components',
        graphqls: './src/core/graphqls',
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
