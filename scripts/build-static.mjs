/**
 * Builds the static export for Apache/cPanel hosting.
 *
 *   npm run build:static
 *
 * Produces out/ containing the whole site plus contact.php and .htaccess,
 * ready to upload to public_html.
 *
 * A static export cannot contain route handlers, so src/app/api is moved aside
 * for the duration of the build and restored afterwards (including on failure).
 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, renameSync, rmSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const apiDir = path.join(root, "src", "app", "api");
const apiStash = path.join(root, ".api-stash");
const phpDir = path.join(root, "php");
const outDir = path.join(root, "out");

function restoreApi() {
  if (existsSync(apiStash)) {
    if (existsSync(apiDir)) rmSync(apiDir, { recursive: true, force: true });
    renameSync(apiStash, apiDir);
  }
}

// Restore even if the build is interrupted.
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    restoreApi();
    process.exit(1);
  });
}

try {
  rmSync(outDir, { recursive: true, force: true });
  rmSync(apiStash, { recursive: true, force: true });
  // A previous build/dev run generates route types that reference src/app/api.
  // Those would fail type checking once the route is moved aside.
  rmSync(path.join(root, ".next"), { recursive: true, force: true });

  if (existsSync(apiDir)) {
    renameSync(apiDir, apiStash);
    console.log("• Moved src/app/api aside for the static build");
  }

  const result = spawnSync("npx", ["next", "build"], {
    stdio: "inherit",
    env: {
      ...process.env,
      STATIC_EXPORT: "true",
      NEXT_PUBLIC_CONTACT_ENDPOINT: "/contact.php",
    },
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    throw new Error(`next build failed with exit code ${result.status}`);
  }
} finally {
  restoreApi();
  console.log("• Restored src/app/api");
}

if (!existsSync(outDir)) {
  console.error("✗ Expected an out/ directory but none was produced.");
  process.exit(1);
}

// Copy the PHP handler, its config template and .htaccess into the upload folder.
mkdirSync(outDir, { recursive: true });
for (const entry of readdirSync(phpDir)) {
  cpSync(path.join(phpDir, entry), path.join(outDir, entry));
  console.log(`• Added ${entry}`);
}

console.log(`
✓ Static site ready in out/

Next steps:
  1. Rename out/contact-config.example.php to contact-config.php and fill it in
     (or create it directly on the server).
  2. Upload EVERYTHING inside out/ — including the hidden .htaccess — to
     public_html on your host.

See DEPLOY-CPANEL.md for the full walkthrough.
`);
