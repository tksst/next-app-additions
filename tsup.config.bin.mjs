import { binOptions } from "@tksst/project-configs/tsup-config.mjs";
import { defineConfig } from "tsup";

export default defineConfig({
    ...binOptions,
    entry: ["src/bin/index.ts"],
});
