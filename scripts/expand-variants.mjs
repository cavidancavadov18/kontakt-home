import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/catalog.json"), "utf8")
);

const STORAGE = ["128-gb", "256-gb", "512-gb", "1-tb", "2-tb"];
const LABEL = {
  "128-gb": "128 GB",
  "256-gb": "256 GB",
  "512-gb": "512 GB",
  "1-tb": "1 TB",
  "2-tb": "2 TB",
};
const FACTOR = {
  "128-gb": 1,
  "256-gb": 1.14,
  "512-gb": 1.3,
  "1-tb": 1.55,
  "2-tb": 1.82,
};
const COLORS = [
  "cosmic-orange",
  "deep-blue",
  "cobalt-violet",
  "dark-green",
  "starlight",
  "midnight",
  "titanium",
  "silver",
  "black",
  "white",
  "blue",
  "gold",
  "green",
  "purple",
  "pink",
  "gray",
  "grey",
  "red",
  "orange",
  "violet",
  "glacier",
  "burgundy",
  "natural",
  "desert",
  "ultramarine",
  "teal",
  "yellow",
  "lavender",
].sort((a, b) => b.length - a.length);

function parse(slug) {
  let s = slug.toLowerCase();
  let storage = null;
  for (const st of STORAGE) {
    const token = `-${st}`;
    const i = s.indexOf(token);
    if (i !== -1) {
      storage = st;
      s = s.slice(0, i) + s.slice(i + token.length);
      break;
    }
  }
  let color = null;
  for (const col of COLORS) {
    if (s.endsWith(`-${col}`)) {
      color = col;
      s = s.slice(0, -(col.length + 1));
      break;
    }
  }
  return { base: s.replace(/-+$/g, ""), storage, color };
}

function priceFor(price, from, to) {
  const raw = (price / FACTOR[from]) * FACTOR[to];
  const rounded = Math.round(raw);
  return Math.max(0.99, rounded - 0.01);
}

function rename(text, from, to) {
  return text.split(LABEL[from]).join(LABEL[to]);
}

function renameRam(text, fromRam, toRam, storage) {
  if (!fromRam || !toRam || fromRam === toRam) return text;
  const size = LABEL[storage].replace(" GB", "").replace(" TB", "");
  return text
    .split(`${fromRam}/${size}`)
    .join(`${toRam}/${size}`)
    .split(`${fromRam} / ${size}`)
    .join(`${toRam} / ${size}`);
}

const phones = catalog.filter((p) => p.category === "smartfonlar");
const existing = new Set(catalog.map((p) => p.slug));
const groups = new Map();

for (const p of phones) {
  const info = parse(p.slug);
  if (!info.storage || !info.base) continue;
  const list = groups.get(info.base) || [];
  list.push({ ...info, product: p });
  groups.set(info.base, list);
}

const created = [];

for (const [base, items] of groups) {
  const present = new Set(items.map((i) => i.storage));
  const targets = new Set(present);
  const pro = /pro-max|ultra/.test(base);
  if (!pro && (present.has("128-gb") || present.has("256-gb"))) {
    targets.add("128-gb");
    targets.add("256-gb");
    targets.add("512-gb");
  }
  if (pro && (present.has("256-gb") || present.has("512-gb"))) {
    targets.add("256-gb");
    targets.add("512-gb");
    targets.add("1-tb");
  }

  const colors = [...new Set(items.map((i) => i.color || ""))];

  for (const color of colors) {
    for (const storage of targets) {
      const slug = `${base}-${storage}${color ? `-${color}` : ""}`;
      if (existing.has(slug)) continue;
      const sameColor = items.filter((i) => (i.color || "") === color);
      const donor =
        sameColor
          .slice()
          .sort(
            (a, b) =>
              Math.abs(STORAGE.indexOf(a.storage) - STORAGE.indexOf(storage)) -
              Math.abs(STORAGE.indexOf(b.storage) - STORAGE.indexOf(storage))
          )[0] || items[0];
      const src = donor.product;
      const price = priceFor(src.price, donor.storage, storage);
      const oldPrice = src.oldPrice
        ? priceFor(src.oldPrice, donor.storage, storage)
        : undefined;
      created.push({
        ...src,
        id: `var-${slug}`,
        slug,
        name: {
          az: rename(src.name.az, donor.storage, storage),
          ru: rename(src.name.ru, donor.storage, storage),
        },
        price,
        oldPrice,
        discount: oldPrice
          ? Math.round(((oldPrice - price) / oldPrice) * 100)
          : src.discount,
        reviewCount: 0,
        description: {
          az: rename(src.description?.az || src.name.az, donor.storage, storage),
          ru: rename(src.description?.ru || src.name.ru, donor.storage, storage),
        },
      });
      existing.add(slug);
    }
  }
}

const clusters = new Map();
for (const [base, items] of groups) {
  const fam = base.match(/^(.*)-([468])$/);
  if (!fam) continue;
  const list = clusters.get(fam[1]) || [];
  list.push({ ram: fam[2], items });
  clusters.set(fam[1], list);
}

for (const [prefix, members] of clusters) {
  if (new Set(members.map((m) => m.ram)).size < 2) continue;
  const flat = members.flatMap((m) => m.items.map((item) => ({ ...item, ram: m.ram })));
  const colors = [...new Set(flat.map((i) => i.color || ""))];
  const storages = [...new Set(flat.map((i) => i.storage))];
  const rams = [...new Set(flat.map((i) => i.ram))];

  for (const color of colors) {
    for (const ram of rams) {
      for (const storage of storages) {
        const slug = `${prefix}-${ram}-${storage}${color ? `-${color}` : ""}`;
        if (existing.has(slug)) continue;
        const sameColor = flat.filter((i) => (i.color || "") === color);
        const donor =
          sameColor
            .slice()
            .sort(
              (a, b) =>
                Math.abs(STORAGE.indexOf(a.storage) - STORAGE.indexOf(storage)) -
                Math.abs(STORAGE.indexOf(b.storage) - STORAGE.indexOf(storage))
            )[0] || flat[0];
        const src = donor.product;
        const price = priceFor(src.price, donor.storage, storage);
        const oldPrice = src.oldPrice
          ? priceFor(src.oldPrice, donor.storage, storage)
          : undefined;
        created.push({
          ...src,
          id: `var-${slug}`,
          slug,
          name: {
            az: renameRam(rename(src.name.az, donor.storage, storage), donor.ram, ram, storage),
            ru: renameRam(rename(src.name.ru, donor.storage, storage), donor.ram, ram, storage),
          },
          price,
          oldPrice,
          discount: oldPrice
            ? Math.round(((oldPrice - price) / oldPrice) * 100)
            : src.discount,
          reviewCount: 0,
          description: {
            az: renameRam(
              rename(src.description?.az || src.name.az, donor.storage, storage),
              donor.ram,
              ram,
              storage
            ),
            ru: renameRam(
              rename(src.description?.ru || src.name.ru, donor.storage, storage),
              donor.ram,
              ram,
              storage
            ),
          },
        });
        existing.add(slug);
      }
    }
  }
}

const out = path.join(root, "src/data/phone-variants.json");
fs.writeFileSync(out, JSON.stringify(created));
console.log(`created ${created.length} variants`);
