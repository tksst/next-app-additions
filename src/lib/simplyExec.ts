import { spawn } from "child_process";

export default function simplyExec(cmd: string, args: string[]): Promise<void> {
    const x = spawn(cmd, args, { stdio: "inherit" });

    return new Promise((resolve) => {
        x.on("exit", (code, signal) => {
            if (code !== null && code !== 0) {
                console.log(`${cmd} exited with status ${code}`);
                process.exit(1);
            }
            if (signal !== null) {
                console.log(`${cmd} exited with signal ${signal}`);
                process.exit(1);
            }

            resolve();
        });
    });
}
