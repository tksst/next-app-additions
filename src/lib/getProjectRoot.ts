import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const filename = fileURLToPath(import.meta.url);

async function fileExists(filePath: string): Promise<boolean> {
    try {
        const x = await fs.stat(filePath);
        return x.isFile();
    } catch (error) {
        return false;
    }
}

const getProjectRoot = async (): Promise<string | undefined> => {
    let p = filename;

    for (;;) {
        p = path.resolve(p, "../");
        // eslint-disable-next-line no-await-in-loop
        if (await fileExists(path.join(p, "package.json"))) {
            return p;
        }
        if (p === "/" || p === "") {
            return undefined;
        }
    }
};

export default getProjectRoot;
