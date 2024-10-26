import * as esbuild from "npm:esbuild";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader";

const result = await esbuild.build({
  plugins: [...denoPlugins()],
  entryPoints: ["https://deno.land/std@0.185.0/bytes/mod.ts"],
  outfile: "./dist/bytes.esm.js",
  bundle: true,
  format: "esm",
});

esbuild.stop();
