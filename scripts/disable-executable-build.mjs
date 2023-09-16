#! /usr/bin/env node

import fs from "node:fs/promises";

import checkGitStatus from "./internal/checkGitStatus.mjs";
import modifyPackageJson from "./internal/modifyPackageJson.mjs";

checkGitStatus();

await Promise.all([
    fs.rm("./tsup.config.bin.mjs", { force: true }),
    fs.rm("./scripts/disable-executable-build.mjs", { force: true }),
    fs.rm("./src/bin/", { recursive: true, force: true }),
    modifyPackageJson((obj) => {
        delete obj.bin;
        delete obj.scripts["build:bin"];
        delete obj.scripts["watch:bin"];
        delete obj.dependencies["source-map-support"];
    }),
]);
