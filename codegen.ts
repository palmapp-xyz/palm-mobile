import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'https://api-mumbai.lens.dev',
  documents: ['src/graphqls/**/*'],
  generates: {
    './src/graphqls/__generated__/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'graphql',
      },
    },
  },
  ignoreNoDocuments: true,
}

export default config
