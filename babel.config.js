// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
module.exports = function (api) {
  api.cache(true)

  const moduleResolver = [
    'module-resolver',
    {
      root: './',
      alias: {
        'palm-core': './src/palm-core',
        'palm-react': './src/palm-react',
        'palm-react-native': './src/palm-react-native',

        assets: './src/assets',
        consts: './src/consts',
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
