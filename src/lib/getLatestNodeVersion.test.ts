import { readFile } from "node:fs/promises";

import { expect, test, vitest } from "vitest";

import getLatestNodeVersion from "./getLatestNodeVersion.js";

test("latest v16", async () => {
    vitest.spyOn(globalThis, "fetch").mockImplementationOnce(
        () =>
            /* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any */
            Promise.resolve({
                ok: true,
                text() {
                    return readFile(new URL("./test/latest-v16.x", import.meta.url), "utf8");
                },
            } as any),
        /* eslint-enable */
    );

    expect(await getLatestNodeVersion(16)).toBe("16.20.2");
});

test("error", async () => {
    vitest.spyOn(globalThis, "fetch").mockImplementationOnce(() =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
        Promise.resolve({ ok: false, status: 404 } as any),
    );

    await expect(getLatestNodeVersion(16)).rejects.toThrow();
});
