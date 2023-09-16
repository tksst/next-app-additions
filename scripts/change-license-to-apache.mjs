#! /usr/bin/env node

import fs from "node:fs/promises";
import https from "node:https";

import checkGitStatus from "./internal/checkGitStatus.mjs";
import modifyPackageJson from "./internal/modifyPackageJson.mjs";

async function download(url, path) {
    const fd = await fs.open(path, "w");
    await new Promise((resolve, reject) => {
        https
            .get(url, (res) => {
                if (res.statusCode !== 200) {
                    reject(new Error(`status code ${res.statusCode}`));
                }

                res.pipe(fd.createWriteStream());

                res.on("end", () => {
                    resolve();
                });
                res.on("error", (err) => {
                    reject(err);
                });
            })
            .on("error", (err) => {
                reject(err);
            });
    });
    await fd.close();
}

const licenseUrl =
    "https://raw.githubusercontent.com/apache/www-site/01b1be9fbc5cd93b6794f5653a58b9b863807f84/content/licenses/LICENSE-2.0.txt";

checkGitStatus();

await Promise.all([
    download(licenseUrl, "./LICENSE"),
    modifyPackageJson((obj) => {
        obj.license = "Apache-2.0";
    }),
    fs.rm("./scripts/change-license-to-apache.mjs", { force: true }),
]);
