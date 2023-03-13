// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
module.exports = function (api) {
  api.cache(true)

  const moduleResolver = [
    'module-resolver',
    {
      root: './',
      alias: {
        libs: './src/libs',
        hooks: './src/hooks',
        store: './src/store',
        assets: './src/assets',
        types: './src/types',
        consts: './src/consts',
        components: './src/components',
        graphqls: './src/graphqls',
      },
    },
  ]

  const plugins = [moduleResolver]
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins,
  }
}
