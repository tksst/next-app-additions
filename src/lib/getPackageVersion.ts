import { spawnSync } from "node:child_process";

export default function getPackageVersion(pkg: string): string {
    const { status, signal, stdout } = spawnSync("npm", ["view", pkg, "version"], {
        stdio: ["ignore", "pipe", "inherit"],
        encoding: "utf-8",
    });
    if (status !== null && status !== 0) {
        console.log(stdout);
        throw new Error(`npm exited with status ${status}`);
    }

    if (signal !== null) {
        throw new Error(`npm exited with signal ${signal}`);
    }

    return stdout.trim();
}
