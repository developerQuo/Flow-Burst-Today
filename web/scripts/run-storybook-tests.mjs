import { spawn } from "node:child_process";
import { createReadStream, existsSync, statSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const webDir = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const staticDir = path.join(webDir, "storybook-static");
const port = Number(process.env.STORYBOOK_TEST_PORT || 7007);

const contentTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".txt": "text/plain; charset=utf-8",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
};

const run = (command, args, env = {}) =>
    new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd: webDir,
            env: { ...process.env, ...env },
            stdio: "inherit",
        });

        child.on("error", reject);
        child.on("close", (code) => {
            resolve(code ?? 1);
        });
    });

if (!existsSync(staticDir)) {
    console.error(
        `storybook-static directory is missing at ${staticDir}. Run build-storybook first.`,
    );
    process.exit(1);
}

const server = http.createServer((req, res) => {
    const reqUrl = new URL(req.url || "/", "http://127.0.0.1");
    const pathname = decodeURIComponent(reqUrl.pathname);
    const relativePath = pathname === "/" ? "index.html" : pathname.slice(1);
    const candidate = path.normalize(path.join(staticDir, relativePath));

    if (!candidate.startsWith(staticDir)) {
        res.statusCode = 403;
        res.end("Forbidden");
        return;
    }

    let filePath = candidate;
    if (existsSync(filePath) && statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, "index.html");
    }

    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
        res.statusCode = 404;
        res.end("Not found");
        return;
    }

    const extension = path.extname(filePath).toLowerCase();
    res.setHeader(
        "Content-Type",
        contentTypes[extension] || "application/octet-stream",
    );
    createReadStream(filePath).pipe(res);
});

server.on("error", (error) => {
    console.error(`Failed to start storybook-static server on port ${port}.`);
    console.error(error);
    process.exit(1);
});

server.listen(port, "127.0.0.1", async () => {
    const pnpmCommand = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
    let exitCode = 1;

    try {
        // Use `pnpm exec` so `--url` is passed directly to test-storybook.
        exitCode = await run(
            pnpmCommand,
            ["exec", "test-storybook", "--url", `http://127.0.0.1:${port}`],
            { CI: "1", STORYBOOK_DISABLE_TELEMETRY: "1" },
        );
    } catch (error) {
        console.error("Failed to run storybook test runner.");
        console.error(error);
    }

    server.close(() => {
        process.exit(exitCode);
    });
});
