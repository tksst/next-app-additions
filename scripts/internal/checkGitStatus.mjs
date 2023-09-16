import { spawnSync } from "node:child_process";

export default function checkGitStatus() {
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
        console.log("uncommitted change remained:\n");
        console.log(gitStatusResult.stdout);
        process.exit(1);
    }
}
