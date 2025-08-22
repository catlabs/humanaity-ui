import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:8080/graphql',
  documents: ['src/app/**/*.graphql'],
  generates: {
    'src/app/core/graphql/models.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-apollo-angular'
      ],
    },
  },
};

export default config;
