import fs from "node:fs/promises";

export default async function modifyPackageJson(func) {
    const obj = JSON.parse(await fs.readFile("./package.json"));
    func(obj);
    await fs.writeFile("./package.json", `${JSON.stringify(obj, undefined, "  ")}\n`);
}
