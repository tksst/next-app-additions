#!/usr/bin/env node

import "source-map-support/register.js";

import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

import getLatestNodeVersion from "../lib/getLatestNodeVersion.js";
import getPackageVersion from "../lib/getPackageVersion.js";
import getProjectRoot from "../lib/getProjectRoot.js";
import simplyExec from "../lib/simplyExec.js";

const PNPM_MAJOR = 8;
const NODEJS_MAJOR = 20;

async function modifyJson(filePath: string, func: (packagejson: JSONObject) => void): Promise<void> {
    const obj = JSON.parse(await fs.readFile(filePath, { encoding: "utf-8" }));
    if (typeof obj !== "object" || Array.isArray(obj) || obj === null) {
        throw new Error(`${filePath} is not an object`);
    }
    func(obj);
    await fs.writeFile(filePath, `${JSON.stringify(obj, undefined, "  ")}\n`);
}

async function copyFiles(): Promise<void> {
    const promises: Promise<void>[] = [];

    const root = await getProjectRoot();
    if (root === undefined) {
        throw new Error("unable to found");
    }

    for await (const dirent of await fs.opendir(path.join(root, "src", "files"))) {
        if (dirent.isFile()) {
            const dstName = dirent.name.replace(/^dot-/, ".");

            promises.push(fs.cp(path.join(root, "src", "files", dirent.name), dstName, { errorOnExist: true }));
        }
        if (dirent.isDirectory()) {
            promises.push(
                fs.cp(path.join(root, "src", "files", dirent.name), dirent.name, {
                    recursive: true,
                    errorOnExist: true,
                }),
            );
        }
    }

    await Promise.all(promises);
}

function checkGitStatus() {
    const gitStatusResult = spawnSync("git", ["status", "--porcelain", "--ignore-submodules"], {
        stdio: ["ignore", "pipe", "inherit"],
        encoding: "utf-8",
    });

    if (gitStatusResult.status === null) {
        console.log(`git status exit with signal ${gitStatusResult.signal}`);
        process.exit(1);
    }

    if (gitStatusResult.status !== 0) {
        console.log(`git status with exit code ${gitStatusResult.status}`);
        process.exit(1);
    }

    if (gitStatusResult.stdout !== "") {
        console.log("uncommitted change remained:");
        console.log(gitStatusResult.stdout);
        console.log("Please COMMIT or STASH and try again.");
        process.exit(2);
    }
}

const main = async (): Promise<void> => {
    checkGitStatus();

    // Copy some configuration files
    await copyFiles();

    // add .nvmrc for latest Node.js ${NODEJS_MAJOR}
    await fs.writeFile(".nvmrc", `${await getLatestNodeVersion(NODEJS_MAJOR)}\n`, { encoding: "utf-8" });

    // install additional packages
    console.log("Installing additional packages:");
    await simplyExec("pnpm", [
        "add",
        "-D",
        "prettier",
        "@tksst/prettier-config",
        "eslint-config-prettier",
        "eslint-plugin-simple-import-sort",
        "secretlint",
        "@secretlint/secretlint-rule-preset-recommend",
        "better-typescript-lib",
        "npm-run-all",
    ]);
    console.log("Installed.");
    console.log();

    // recreate node_modules because for some reason public-hoist-pattern does not work.
    console.log("Recreating node_modules:");
    await fs.rm("node_modules", { force: true, recursive: true });
    await simplyExec("pnpm", ["install"]);
    console.log("Done.");
    console.log();

    // modify package.json
    await modifyJson("package.json", (packagejson: JSONObject) => {
        packagejson.packageManager = `pnpm@${getPackageVersion(`pnpm@latest-${PNPM_MAJOR}`)}`;

        const x = packagejson.scripts;

        if (typeof x !== "object" || Array.isArray(x) || x === null) {
            throw new Error("package.json is in an unexpected format.");
        }

        x["lint:eslint"] = "next lint";
        x["lint:prettier"] = "prettier --cache --check .";
        x["lint:secretlint"] = "secretlint --maskSecrets **";
        x.lint = "run-p --continue-on-error --print-label lint:*";
        x["fix:eslint"] = "eslint --color --fix .";
        x["fix:prettier"] = "prettier --cache --write .";
        x.fix = "run-s --continue-on-error fix:*";
    });

    // modify tsconfig.json
    await modifyJson("tsconfig.json", (tsconfigJson: JSONObject) => {
        const x = tsconfigJson.compilerOptions;
        if (typeof x !== "object" || Array.isArray(x) || x === null) {
            throw new Error("tsconfig.json is in an unexpected format.");
        }

        x.target = "ES2015";
        x.noImplicitOverride = true;
        x.noImplicitReturns = true;
        x.noUncheckedIndexedAccess = true;
        x.exactOptionalPropertyTypes = true;
    });

    // modify .eslintrc.json
    await modifyJson(".eslintrc.json", (eslintrcJson: JSONObject) => {
        const oldExtends = eslintrcJson.extends;
        if (Array.isArray(oldExtends)) {
            oldExtends.push("prettier");
        } else if (typeof oldExtends === "string") {
            eslintrcJson.extends = [oldExtends, "prettier"];
        } else {
            throw new Error(".eslintrc.json is in an unexpected format.");
        }

        eslintrcJson.plugins = ["simple-import-sort"];
        eslintrcJson.rules = {
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
        };
    });

    console.log("@tksst/next-app-additions done.");
};

await main();
