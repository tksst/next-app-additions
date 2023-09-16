#! /usr/bin/env node

import fs from "node:fs/promises";

import checkGitStatus from "./internal/checkGitStatus.mjs";
import modifyPackageJson from "./internal/modifyPackageJson.mjs";

checkGitStatus();

await Promise.all([
    fs.rm("./tsup.config.lib.mjs", { force: true }),
    fs.rm("./scripts/disable-library-build.mjs", { force: true }),
    modifyPackageJson((obb) => {
        delete obb.exports;
        delete obb.types;
        delete obb.scripts["build:lib"];
        delete obb.scripts["watch:lib"];
    }),
]);
