
    import { build, emptyDir } from "jsr:@deno/dnt";

    await emptyDir("./npm");

    await build({
      entryPoints: ["./index.ts"],
      outDir: "./npm",
      shims: {
        // see JS docs for overview and more options
        deno: true,
      },
      package: {"name":"epic-api-core","version":"0.0.0","author":"Epic API Core","license":"MIT","homepage":"https://oridune.com"},
    });
    