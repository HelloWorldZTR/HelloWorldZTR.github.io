import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [type, slug] = process.argv.slice(2);
const directories = {
  project: "projects",
  publication: "publications"
};

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!directories[type]) {
  fail("Usage: npm run new -- <project|publication> <lowercase-slug>");
}
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  fail("The slug must contain lowercase letters, numbers, and single hyphens only.");
}

const destination = path.join(projectRoot, "content", directories[type], `${slug}.md`);

try {
  await fs.access(destination);
  fail(`Refusing to overwrite existing file: ${path.relative(projectRoot, destination)}`);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const title = slug
  .split("-")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");

const template = type === "project"
  ? `---
title: "${title}"
date: "${new Date().toISOString().slice(0, 10)}"
summary: "Add a short project summary."
url: ""
---

Describe the project here.
`
  : `---
title: "${title}"
year: "${new Date().getUTCFullYear()}"
authors: ""
venue: ""
summary: "Add a short publication summary."
url: ""
---

Add the abstract, citation, or publication notes here.
`;

await fs.writeFile(destination, template, { encoding: "utf8", flag: "wx" });
console.log(`Created ${path.relative(projectRoot, destination)}`);
