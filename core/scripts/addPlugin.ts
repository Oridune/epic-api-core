import { parse } from "flags";
import { join } from "path";
import { exists } from "fs";
import e from "validator";

import { Input } from "cliffy:prompt";
import Manager from "@Core/common/manager.ts";

export enum PluginSource {
  GIT = "git",
}

export const resolvePluginName = (name: string) =>
  name
    .split("/")
    .filter(Boolean)
    .join("/")
    .split("\\")
    .filter(Boolean)
    .join("\\");

export const addPluginToImportMap = async (
  name: string
): Promise<{
  imports: Record<string, string>;
  scopes: Record<string, Record<string, string>>;
}> => {
  const ImportMapPath = join(Deno.cwd(), "import_map.json");
  const PluginImportMapPath = join(
    Deno.cwd(),
    "plugins",
    name,
    "import_map.json"
  );

  const ImportMap = (
    await import(`file:///${ImportMapPath}`, {
      assert: { type: "json" },
    })
  ).default;

  const RelativePluginPath = `./plugins/${name}/`;

  ImportMap.imports = {
    ...ImportMap.imports,
    [`@Plugin/${name}/`]: RelativePluginPath,
  };

  ImportMap.scopes = {
    ...ImportMap.scopes,
    [RelativePluginPath]: {
      "@Controllers/": `./plugins/${name}/controllers/`,
      "@Models/": `./plugins/${name}/models/`,
      "@Jobs/": `./plugins/${name}/jobs/`,
      "@Middlewares/": `./plugins/${name}/middlewares/`,
    },
  };

  const PluginImportMap = (
    await import(`file:///${PluginImportMapPath}`, {
      assert: { type: "json" },
    })
  ).default;

  const ImportKeys = Object.keys(ImportMap.imports ?? {});
  const PluginImportKeys = Object.keys(PluginImportMap.imports ?? {});

  for (const Key of PluginImportKeys.filter((key) => !ImportKeys.includes(key)))
    if (!/^@Plugin\/.*/.test(Key))
      ImportMap.scopes[RelativePluginPath][Key] =
        PluginImportMap.imports?.[Key];

  await Deno.writeTextFile(
    ImportMapPath,
    JSON.stringify(ImportMap, undefined, 2)
  );

  return ImportMap;
};

export const updatePluginDeclarationFile = async () => {
  const DeclarationFilePath = join(Deno.cwd(), "plugins.d.ts");
  const PluginsNameSet = await Manager.getSequence("plugins", { strict: true });

  let DeclarationFileContent =
    "//! Warning: This is an auto-generated file! Please do not edit this file.";

  for (const PluginName of Array.from(PluginsNameSet)) {
    const RelativePluginDeclarationPath = `./plugins/${PluginName}/index.d.ts`;

    if (await exists(RelativePluginDeclarationPath))
      DeclarationFileContent += `\n/// <reference types="${RelativePluginDeclarationPath}" />`;
  }

  await Deno.writeTextFile(DeclarationFilePath, DeclarationFileContent);

  return DeclarationFileContent;
};

export const addPlugin = async (options: {
  source?: PluginSource;
  name: string | string[];
  prompt?: boolean;
}) => {
  try {
    const Options = await e
      .object(
        {
          source: e
            .optional(e.enum(Object.values(PluginSource)))
            .default(PluginSource.GIT),
          name: e
            .optional(e.array(e.string(), { cast: true, splitter: "," }))
            .default(async (ctx) =>
              ctx.parent!.input.prompt
                ? [
                    await Input.prompt({
                      message: "Name of the Plugin",
                    }),
                  ]
                : undefined
            ),
        },
        { allowUnexpectedProps: true }
      )
      .validate(options);

    if (Options.name) {
      const PluginsDir = join(Deno.cwd(), "plugins");

      for (const PluginName of Options.name) {
        let ResolvePluginName = PluginName;
        let Process:
          | Deno.Process<{
              cmd: string[];
              cwd: string;
            }>
          | undefined;

        const GitRepoUrl = new URL(ResolvePluginName, "https://github.com");

        // Resolve plugin name according to Git scheme.
        if (Options.source === PluginSource.GIT)
          ResolvePluginName = resolvePluginName(GitRepoUrl.pathname);

        // Check if plugin already exists.
        if ((await Manager.getSequence("plugins")).has(ResolvePluginName))
          throw new Error(
            `The plugin '${ResolvePluginName}' already exists on this project!`
          );

        // Clone Repository from Git.
        if (Options.source === PluginSource.GIT)
          Process = Deno.run({
            cmd: ["git", "clone", GitRepoUrl.toString(), ResolvePluginName],
            cwd: PluginsDir,
          });

        if (Process) {
          const Status = await Process.status();

          if (Status.success) {
            await Manager.setSequence("plugins", (seq) =>
              seq.add(ResolvePluginName)
            );

            await addPluginToImportMap(ResolvePluginName);
            await updatePluginDeclarationFile();

            for (const EntryName of [
              ".git",
              "core",
              "env",
              ".gitattributes",
              ".gitignore",
            ])
              try {
                await Deno.remove(
                  join(PluginsDir, ResolvePluginName, EntryName),
                  { recursive: true }
                );
              } catch {
                // Do nothing...
              }

            console.info("Plugin has been added successfully!");
          } else throw new Error("We were unable to add this plugin!");

          Process.close();
        } else throw new Error(`Oops! Something went wrong!`);
      }
    }
  } catch (error) {
    console.error(error, error.issues);
    throw error;
  }
};

if (import.meta.main) {
  const { source, s, name, n } = parse(Deno.args);

  addPlugin({
    source: source ?? s,
    name: name ?? n,
    prompt: true,
  });
}
