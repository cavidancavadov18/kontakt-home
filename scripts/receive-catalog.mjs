import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outFile = path.join(__dirname, "..", "src", "data", "catalog.json");
const metaFile = path.join(__dirname, "..", "src", "data", "catalog-meta.json");

/** @type {Map<string, any>} */
const products = new Map();

if (fs.existsSync(outFile)) {
  try {
    const existing = JSON.parse(fs.readFileSync(outFile, "utf8"));
    for (const p of existing) products.set(String(p.id), p);
    console.log(`Loaded ${products.size} existing products`);
  } catch {
    console.log("Starting fresh catalog");
  }
}

function save() {
  const list = [...products.values()];
  fs.writeFileSync(outFile, JSON.stringify(list));
  fs.writeFileSync(
    metaFile,
    JSON.stringify(
      {
        count: list.length,
        updatedAt: new Date().toISOString(),
      },
      null,
      2
    )
  );
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "GET" && req.url === "/status") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ count: products.size }));
    return;
  }

  if (req.method === "POST" && req.url === "/products") {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    try {
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      const items = Array.isArray(body) ? body : body.items || [];
      let added = 0;
      for (const item of items) {
        const id = String(item.id);
        if (!products.has(id)) added += 1;
        products.set(id, item);
      }
      save();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, added, total: products.size }));
      console.log(`+${added} → total ${products.size}`);
    } catch (e) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: String(e) }));
    }
    return;
  }

  res.writeHead(404);
  res.end("not found");
});

server.listen(3921, "127.0.0.1", () => {
  console.log("Catalog receiver on http://127.0.0.1:3921");
  console.log(`Writing to ${outFile}`);
});
