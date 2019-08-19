import { codegen } from "@graphql-codegen/core";
import { CodegenPlugin, Types } from "@graphql-codegen/plugin-helpers";
import * as fs from "fs";
import { parse } from "graphql";
import { Compiler } from "webpack";

type PluginMap = {
  [name: string]: CodegenPlugin;
};

interface PluginOptions {
  filename: string;
  plugins: Types.ConfiguredPlugin[];
  schemaFile: string;
  documents: Types.DocumentFile[];
  config: {
    [key: string]: any;
  };
  pluginMap: PluginMap;
  skipDuplicateDocumentsValidation?: boolean;
}

const TS_PLUGIN_KEYS = [
  "TsVisitor",
  "TsIntrospectionVisitor",
  "TypeScriptOperationVariablesToObject"
];

export default class GraphQLCodeGenPlugin {
  public options: PluginOptions;

  constructor(options?: PluginOptions) {
    this.validateOptions(options);
    this.options = {
      config: {},
      pluginMap: {},
      plugins: [],
      documents: [],
      ...options!
    };
  }

  public apply(compiler: Compiler) {
    const { schemaFile, ...otherOptions } = this.options;
    compiler.hooks.beforeCompile.tapPromise("@graphql-codegen/webpack-plugin", () =>
      codegen({
        ...otherOptions,
        schema: parse(fs.readFileSync(this.options.schemaFile, "utf-8"))
      }).then((output) => {
        if (output) {
          // Works around a bug with the Typescript plugin, where it returns the
          // output instead of writing it to a file. But we don't want to lose the
          // other plugins' outputs.
          if (this.isTypescriptPluginOneOfMany()) {
            fs.appendFileSync(this.options.filename, "\n\n" + output, "utf-8");
          } else {
            fs.writeFileSync(this.options.filename, output, "utf-8");
          }
        }
      })
    );
  }

  private isTypescriptPluginOneOfMany(): boolean {
    const keys = Object.keys(this.options.pluginMap);
    if (keys.length <= 1) {
      return false;
    }

    return keys.some((pluginName) =>
      // @ts-ignore
      TS_PLUGIN_KEYS.every((field) => pluginMap[pluginName] && pluginMap[pluginName][field])
    );
  }

  private validateOptions(options: any): options is PluginOptions {
    if (!options || typeof options !== "object") {
      throw new Error("Please provide an options object.");
    }

    if (!options.filename || typeof options.filename !== "string") {
      throw new Error("Options must contain 'filename' with the output path.");
    }

    if (!options.plugins) {
      throw new Error("Options must contain 'plugins' with a map of plugin config.");
    }

    if (!options.pluginMap) {
      throw new Error("Options must contain 'pluginMap' with a map of plugins to run.");
    }

    if (!options.schemaFile || typeof options.schemaFile !== "string") {
      throw new Error("Options must contain 'schemaFile' with the path to a valid schema.");
    }

    return true;
  }
}
