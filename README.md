# graphql-code-generator-webpack-plugin

Runs [GraphQL Code Generator](https://github.com/dotansimha/graphql-code-generator) as part of the Webpack compilation process. It will run before type-checkers like fork-ts-checker-webpack-plugin.

## Usage

This plugin takes the same options as graphql-codegen, with one exception:
Instead of passing a GraphQL schema through `schema`, you pass the location to the schema file through `schemaFile`.

For details about graphql-codegen options, see the [graphql-codegen documentation](https://graphql-code-generator.com/docs/getting-started/programmatic-usage).

Install as a dev dependency:

```bash
npm install --save-dev graphql-code-generator-webpack-plugin
```

Then, add the plugin to the `plugins` array in your Webpack config. Also include the graphql-codegen plugins you wish to use:

```javascript
import GraphqlCodegen from "graphql-code-generator-webpack-plugin";

import * as GraphqlCodegenTypescript from "@graphql-codegen/typescript";
import * as GraphqlCodegenTypescriptResolvers from "@graphql-codegen/typescript-resolvers";

// ....

plugins: [
  new GraphqlCodegen({
    filename: path.join(__dirname, "./src/graphql/generated/graphql.ts"),
    schemaFile: path.join(__dirname, "./src/graphql/schema.graphql"),
    plugins: [
      {
        typescript: {}
      },
      {
        typescriptResolvers: {}
      }
    ],
    config: {
      avoidOptionals: true
    },
    pluginMap: {
      typescript: GraphqlCodegenTypescript,
      typescriptResolvers: GraphqlCodegenTypescriptResolvers
    }
  })
];
```
