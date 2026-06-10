#!/usr/bin/env node
// Corre el contenedor web eligiendo un puerto de host libre automaticamente.
// - Si HOST_PORT esta definido, usa ese (y falla si esta ocupado).
// - Si no, busca el primer puerto libre empezando en 3000.
import { spawnSync } from "node:child_process";
import net from "node:net";

const IMAGE = "equipo85-web";
const CONTAINER_PORT = 3000;
const START_PORT = 3000;
const MAX_TRIES = 20;

function isFree(port) {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.once("error", () => resolve(false));
    srv.once("listening", () => srv.close(() => resolve(true)));
    srv.listen(port, "0.0.0.0");
  });
}

async function pickPort() {
  if (process.env.HOST_PORT) {
    const p = Number(process.env.HOST_PORT);
    if (!(await isFree(p))) {
      console.error(`✖ El puerto ${p} (HOST_PORT) ya esta ocupado.`);
      process.exit(1);
    }
    return p;
  }
  for (let p = START_PORT; p < START_PORT + MAX_TRIES; p++) {
    if (await isFree(p)) return p;
  }
  console.error(`✖ No se encontro puerto libre entre ${START_PORT} y ${START_PORT + MAX_TRIES}.`);
  process.exit(1);
}

const port = await pickPort();
if (port !== START_PORT) {
  console.log(`ℹ Puerto ${START_PORT} ocupado, usando ${port}.`);
}
console.log(`▲ App disponible en: http://localhost:${port}\n`);

const args = ["run", "--rm", "-p", `${port}:${CONTAINER_PORT}`, IMAGE];
const res = spawnSync("docker", args, { stdio: "inherit" });
process.exit(res.status ?? 0);
