#!/usr/bin/env node

import { execSync } from "child_process";
import net from "net";

const findFreePort = async (startPort = 3000) => {
  let port = startPort;
  while (port < 65535) {
    const server = net.createServer();
    try {
      await new Promise((resolve, reject) => {
        server.once("error", reject);
        server.once("listening", resolve);
        server.listen(port, "127.0.0.1");
      });
      server.close();
      return port;
    } catch (error) {
      port++;
    }
  }
  throw new Error("No free port found");
};

async function main() {
  try {
    const port = await findFreePort(3000);
    console.log(`\n🐳 Starting App BiT on port ${port}...`);

    const cmd = `docker run -it --rm -p ${port}:3000 appbit:latest`;
    console.log(`Running: ${cmd}\n`);

    execSync(cmd, { stdio: "inherit" });
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();
