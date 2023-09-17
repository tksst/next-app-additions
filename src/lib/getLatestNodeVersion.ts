export default async function getLatestNodeVersion(majorVersion: number): Promise<string> {
    const x = await fetch(`https://nodejs.org/dist/latest-v${majorVersion}.x/`);

    if (!x.ok) {
        throw new Error(`https://nodejs.org returned ${x.status}`);
    }

    const pattern = new RegExp(`node-v(${majorVersion}\\.\\d+\\.\\d+)\\.tar\\.gz`);

    const version = (await x.text()).match(pattern)?.[1];
    if (version === undefined) {
        throw new Error("unable to determine the latest Node.js version");
    }
    return version;
}
