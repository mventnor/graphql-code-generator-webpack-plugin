# @graphql-codegen/webpack-plugin

Runs [GraphQL Code Generator](https://github.com/dotansimha/graphql-code-generator) as part of the Webpack compilation process. It will run before type-checkers like fork-ts-checker-webpack-plugin.

## Usage

This plugin takes the same options as graphql-codegen, with one exception:
Instead of passing a GraphQL schema through `schema`, you pass the location to the schema file through `schemaFile`.

Install as a dev dependency:

```bash
npm install --save-dev @graphql-codegen/webpack-plugin
```

Then, add the plugin to the `plugins` array in your Webpack config:

```javascript
import GraphqlCodegen from "@graphql-codegen/webpack-plugin";

// ....

plugins: [
  new GraphqlCodegen({
    filename: path.join(__dirname, "./src/graphql/generated/graphql.ts"),
    schemaFile: path.join(__dirname, "./src/graphql/schema.graphql"),
    plugins: [
      {
        typescript: {
          avoidOptionals: true
        },
        typescriptResolvers: {
          avoidOptionals: true
        }
      }
    ],
    pluginMap: {
      typescript: GraphqlCodegenTypescript,
      typescriptResolvers: GraphqlCodegenTypescriptResolvers
    }
  })
];
```

Read the [graphql-codegen documentation](https://graphql-code-generator.com/docs/getting-started/programmatic-usage) for more details about options.
