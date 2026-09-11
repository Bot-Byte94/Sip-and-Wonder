import { spawn, spawnSync } from "node:child_process";
import process from "node:process";

const port = Number(process.env.PORT ?? 5173);
const requestedDevice = process.env.IOS_DEVICE ?? "iPhone 16 Pro";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: "utf8", stdio: options.quiet ? ["ignore", "pipe", "pipe"] : "inherit" });
  if (result.status !== 0) throw new Error(`${command} ${args.join(" ")} failed.`);
  return result.stdout?.trim() ?? "";
}

function deviceId() {
  const json = run("xcrun", ["simctl", "list", "devices", "available", "--json"], { quiet: true });
  const devices = Object.values(JSON.parse(json).devices).flat();
  const preferred = devices.find((device) => device.name === requestedDevice);
  const fallback = devices.find((device) => /^iPhone/.test(device.name));
  const selected = preferred ?? fallback;
  if (!selected) throw new Error("No available iPhone simulator was found. Install an iOS Simulator runtime in Xcode.");
  if (selected.name !== requestedDevice) console.log(`iPhone 16 Pro is unavailable; using ${selected.name}.`);
  return selected;
}

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    for (let candidate = port; candidate < port + 10; candidate += 1) {
      try {
        const response = await fetch(`http://localhost:${candidate}`);
        if (response.ok || response.status < 500) return `http://localhost:${candidate}`;
      } catch {}
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`The dev server did not become available on ports ${port}-${port + 9}.`);
}

const device = deviceId();
if (device.state !== "Booted") run("xcrun", ["simctl", "boot", device.udid], { quiet: true });
run("xcrun", ["simctl", "bootstatus", device.udid, "-b"]);
spawn("open", ["-a", "Simulator"], { detached: true, stdio: "ignore" }).unref();

const server = spawn("npm", ["run", "dev", "--", "--host", "0.0.0.0", "--port", String(port)], {
  detached: true,
  stdio: "ignore",
  env: { ...process.env, PORT: String(port) },
});
server.unref();
const url = await waitForServer();
run("xcrun", ["simctl", "openurl", device.udid, url]);
console.log(`Opened ${url} in Safari on ${device.name}.`);
console.log("Stop the dev server with: pkill -f 'run-framework.mjs dev'");
