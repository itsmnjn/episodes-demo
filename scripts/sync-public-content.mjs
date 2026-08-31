import {
  cpSync,
  existsSync,
  linkSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  rmSync,
  unlinkSync,
} from "node:fs";
import path from "node:path";

const root = process.cwd();
const srcRoot = path.join(root, "content");
const destRoot = path.join(root, "public", "content");
const mediaExt = new Set([".jpg", ".jpeg", ".mp4", ".png", ".webp"]);

function walk(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (mediaExt.has(path.extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

if (existsSync(destRoot)) {
  if (lstatSync(destRoot).isSymbolicLink()) unlinkSync(destRoot);
  else rmSync(destRoot, { recursive: true, force: true });
}

mkdirSync(destRoot, { recursive: true });

for (const file of walk(srcRoot)) {
  const dest = path.join(destRoot, path.relative(srcRoot, file));
  mkdirSync(path.dirname(dest), { recursive: true });
  try {
    linkSync(file, dest);
  } catch {
    cpSync(file, dest);
  }
}
