import getLatestNodeVersion from "./getLatestNodeVersion.js";

test("latest v20", async () => {
    const version = await getLatestNodeVersion(20);

    const pattern = /^20\.\d+\.\d+$/;

    expect(pattern.test(version)).toBe(true);
});

test("latest v16", async () => {
    expect(await getLatestNodeVersion(16)).toBe("16.20.2");
});
