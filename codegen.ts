import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'https://api-mumbai.lens.dev',
  documents: ['src/core/graphqls/**/*'],
  generates: {
    './src/core/graphqls/__generated__/': {
      preset: 'client',
      presetConfig: {
        gqlTagName: 'graphql',
      },
    },
  },
  ignoreNoDocuments: true,
}

export default config
