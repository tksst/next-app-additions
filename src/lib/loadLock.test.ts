import { loadLock } from "./loadLock.js";

test("loadLock", async () => {
    const x = await loadLock("./src/lib/test/test-pnpm-lock.yaml");
    expect(x).toEqual({
        dependencies: {
            withVersion: ["next@13.5.6", "react@18.2.0", "react-dom@18.2.0"],
            withoutVersion: ["next", "react", "react-dom"],
        },
        devDependencies: {
            withVersion: [
                "@types/node@20.8.7",
                "@types/react@18.2.31",
                "@types/react-dom@18.2.14",
                "eslint@8.52.0",
                "eslint-config-next@13.5.6",
                "typescript@5.2.2",
            ],
            withoutVersion: [
                "@types/node",
                "@types/react",
                "@types/react-dom",
                "eslint",
                "eslint-config-next",
                "typescript",
            ],
        },
    });
});

test("loadLock only dep", async () => {
    const x = await loadLock("./src/lib/test/test-pnpm-lock-only-dep.yaml");
    expect(x).toEqual({
        dependencies: {
            withVersion: ["next@13.5.6", "react@18.2.0", "react-dom@18.2.0"],
            withoutVersion: ["next", "react", "react-dom"],
        },
        devDependencies: {
            withVersion: [],
            withoutVersion: [],
        },
    });
});
