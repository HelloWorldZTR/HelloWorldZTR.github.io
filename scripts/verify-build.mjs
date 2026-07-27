import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(projectRoot, "dist");
const required = [
  "index.html",
  "projects/index.html",
  "publications/index.html",
  "cv/index.html",
  "404.html",
  "style.css",
  ".nojekyll"
];

for (const file of required) {
  await fs.access(path.join(dist, file));
}

const files = [];
async function visit(directory) {
  for (const item of await fs.readdir(directory, { withFileTypes: true })) {
    const itemPath = path.join(directory, item.name);
    if (item.isDirectory()) await visit(itemPath);
    else files.push(itemPath);
  }
}
await visit(dist);

const javascript = files.filter((file) => /\.(?:js|mjs|cjs)$/i.test(file));
if (javascript.length > 0) {
  throw new Error(`Runtime JavaScript found in dist: ${javascript.join(", ")}`);
}

for (const file of files.filter((item) => /\.(?:html|css|txt)$/i.test(item))) {
  const content = await fs.readFile(file, "utf8");
  if (content.includes("hiztr.cn")) {
    throw new Error(`Old custom domain found in ${path.relative(projectRoot, file)}`);
  }
}

const homepage = await fs.readFile(path.join(dist, "index.html"), "utf8");
for (const href of ["/", "/projects/", "/publications/", "/cv/"]) {
  if (!homepage.includes(`href="${href}"`)) {
    throw new Error(`Homepage is missing navigation link: ${href}`);
  }
}

console.log(`Verified ${files.length} static files with no runtime JavaScript.`);
