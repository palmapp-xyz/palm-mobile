// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
module.exports = function (api) {
  api.cache(true)

  const moduleResolver = [
    'module-resolver',
    {
      root: './',
      alias: {
        'palm-core': './src/palm-core',
        'palm-ui-kit': './src/palm-ui-kit',
        'palm-react': './src/palm-react',
        'palm-react-native': './src/palm-react-native',
        'palm-react-native-ui-kit': './src/palm-react-native-ui-kit',
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
