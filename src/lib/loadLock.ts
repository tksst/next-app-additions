import fs from "node:fs/promises";

import yaml from "js-yaml";

function foo(obj: unknown): string[] {
    if (typeof obj !== "object" || obj === null) {
        return [];
    }

    return Object.entries(obj as Record<string, { version: string }>)
        .map(([k, v]) => [k, v.version])
        .map(([k, v]) => [k, v?.replace(/^(.+?)\(.+$/, "$1")])
        .map(([k, v]) => `${k}@${v}`);
}

export async function loadLock(file = "./pnpm-lock.yaml"): Promise<{
    dependencies: { withVersion: string[]; withoutVersion: string[] };
    devDependencies: { withVersion: string[]; withoutVersion: string[] };
}> {
    const lock = yaml.load(await fs.readFile(file, { encoding: "utf-8" }));

    if (typeof lock !== "object" || lock === null) {
        throw new Error("unexpected pnpm-lock file");
    }

    // lock file version check
    if (!("lockfileVersion" in lock)) {
        console.warn("This pnpm-lock.yaml does not contain lockfileVersion");
    } else if (lock.lockfileVersion !== "6.0") {
        console.warn(`This pnpm-lock.yaml version is unexpected: ${lock.lockfileVersion as string}`);
    }

    let dep = { withVersion: [] as string[], withoutVersion: [] as string[] };

    if ("dependencies" in lock) {
        dep = {
            withVersion: foo(lock.dependencies),
            withoutVersion: Object.keys(lock.dependencies as object),
        };
    }

    let devdep = { withVersion: [] as string[], withoutVersion: [] as string[] };

    if ("devDependencies" in lock) {
        devdep = {
            withVersion: foo(lock.devDependencies),
            withoutVersion: Object.keys(lock.devDependencies as object),
        };
    }

    return {
        dependencies: dep,
        devDependencies: devdep,
    };
}
