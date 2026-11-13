import { spawn } from "node:child_process";
import { mkdirSync, accessSync, constants } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

// Preserve normal Wrangler authentication when the user's configuration is writable.
// Managed cloud machines can expose a read-only home: keep their local state in .wrangler.
let configHome = process.env.XDG_CONFIG_HOME;
if (!configHome) {
  try {
    configHome = join(homedir(), ".config");
    mkdirSync(join(configHome, ".wrangler"), { recursive: true });
    accessSync(join(configHome, ".wrangler"), constants.W_OK);
  } catch {
    configHome = resolve(".wrangler/config");
  }
}
mkdirSync(configHome, { recursive: true });
const child = spawn(
  process.execPath,
  ["node_modules/wrangler/bin/wrangler.js", ...process.argv.slice(2)],
  {
    stdio: "inherit",
    env: { ...process.env, XDG_CONFIG_HOME: configHome },
  },
);
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
child.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.on("exit", (code) => process.exit(code ?? 1));
