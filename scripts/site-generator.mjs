import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";
import { processPhotos } from "./photo-pipeline.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(projectRoot, "content");
const generatedRoot = path.join(projectRoot, ".generated");
const photosSourceRoot = path.join(contentRoot, "photos");
const photosOutputRoot = path.join(projectRoot, "public", "photos");

const navigation = [
  { key: "home", label: "Home", href: "/" },
  { key: "projects", label: "Projects", href: "/projects/" },
  { key: "publications", label: "Publications", href: "/publications/" },
  { key: "cv", label: "CV", href: "/cv/" }
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function stripHtml(value) {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function safeUrl(value) {
  if (!value) return "";
  const url = String(value).trim();
  if (/^(https?:\/\/|mailto:)/i.test(url)) return url;
  throw new Error(`Only http, https, and mailto URLs are allowed: ${url}`);
}

function textValue(value, fallback = "") {
  if (value === undefined || value === null) return fallback;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).trim();
}

async function readConfig() {
  const raw = await fs.readFile(path.join(projectRoot, "site.config.json"), "utf8");
  const config = JSON.parse(raw);
  for (const field of ["title", "author", "description"]) {
    if (!textValue(config[field])) {
      throw new Error(`site.config.json requires a non-empty "${field}" field.`);
    }
  }
  return config;
}

async function readMarkdown(filePath) {
  const source = await fs.readFile(filePath, "utf8");
  const parsed = matter(source);
  return {
    data: parsed.data,
    html: await marked.parse(parsed.content),
    source: parsed.content
  };
}

async function readCollection(name) {
  const directory = path.join(contentRoot, name);
  const files = (await fs.readdir(directory))
    .filter((file) => file.endsWith(".md"))
    .sort();

  const entries = [];
  for (const file of files) {
    const slug = path.basename(file, ".md");
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new Error(`Invalid ${name} slug "${slug}". Use lowercase letters, numbers, and hyphens.`);
    }

    const { data, html } = await readMarkdown(path.join(directory, file));
    const title = textValue(data.title);
    const summary = textValue(data.summary);
    if (!title || !summary) {
      throw new Error(`${path.join("content", name, file)} requires "title" and "summary".`);
    }

    const entry = {
      slug,
      title,
      summary,
      html,
      url: safeUrl(data.url),
      date: textValue(data.date),
      year: textValue(data.year),
      authors: textValue(data.authors),
      venue: textValue(data.venue)
    };

    if (name === "projects" && !entry.date) {
      throw new Error(`${path.join("content", name, file)} requires "date".`);
    }
    if (name === "publications" && !entry.year) {
      throw new Error(`${path.join("content", name, file)} requires "year".`);
    }
    entries.push(entry);
  }

  return entries.sort((a, b) => {
    const left = name === "projects" ? a.date : a.year;
    const right = name === "projects" ? b.date : b.year;
    return right.localeCompare(left) || a.title.localeCompare(b.title);
  });
}

function layout({ config, active, title, body, description = config.description }) {
  const fullTitle = active === "home" ? config.title : `${title} | ${config.title}`;
  const nav = navigation
    .map(({ key, label, href }) => {
      const current = key === active ? ' aria-current="page"' : "";
      return `<form action="${href}" method="get"><button type="submit"${current}>${escapeHtml(label)}</button></form>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(stripHtml(description))}">
  <title>${escapeHtml(fullTitle)}</title>
  <link rel="stylesheet" href="/style.css">
  <script>
  <!--
  (function () {
    var userAgent;

    if (!document.documentElement ||
        typeof window.CSS === "undefined" ||
        typeof window.CSS.supports !== "function" ||
        !window.CSS.supports("filter", "contrast(0.94) saturate(0.84)")) {
      return;
    }

    document.documentElement.className += " crt-enabled";

    userAgent = navigator.userAgent || "";
    if (/(?:Chrome|Chromium)\\//.test(userAgent) &&
        !/(?:CriOS|Edg|OPR)\\//.test(userAgent)) {
      document.documentElement.className += " crt-softened";
    }
  }());
  // -->
  </script>
</head>
<body>
  <div class="oa-shell">
    <div class="utility-bar">
      <span>INTERNAL INFORMATION SYSTEM</span>
      <span class="window-controls" aria-hidden="true">
        <button type="button" tabindex="-1">_</button>
        <button type="button" tabindex="-1">□</button>
        <button type="button" tabindex="-1">×</button>
      </span>
    </div>
    <header class="masthead">
      <div>
        <h1>${escapeHtml(config.title)}'s Profile</h1>
        <p>Personal information</p>
      </div>
    </header>
    <div class="layout">
      <aside class="sidebar">
        <div class="panel-title">USER PROFILE</div>
        <div class="profile">
          <img src="/images/avatar.jpg" width="128" height="128" alt="Avatar of ${escapeHtml(config.author)}">
          <strong>${escapeHtml(config.author)}</strong>
          <div class="profile-description">${config.description}</div>
        </div>
        <nav class="nav-panel" aria-label="Primary navigation">
          ${nav}
        </nav>
        <div class="contact-panel">
          <strong>PERSONAL LINKS</strong>
          <div class="contact-link">
            <img src="/gifs/hand_right.gif" width="64" height="24" alt="">
            <a href="https://github.com/helloworldztr">My GitHub</a>
          </div>
          <div class="contact-link">
            <img src="/gifs/envelope_opens.gif" width="43" height="43" alt="">
            <a href="mailto:hlwdztr@gmail.com">E-mail Me</a>
          </div>
        </div>
      </aside>
      <main class="workspace">
        <div class="window-title">${escapeHtml(title)}</div>
        <div class="content-body">
          ${body}
        </div>
      </main>
    </div>
    <footer class="footer">
      <div class="badges" aria-label="Site technology">
        <img src="/badges/cc-by-sa.gif" width="88" height="31" alt="Creative Commons Attribution-ShareAlike">
        <img src="/badges/css3.gif" width="88" height="31" alt="CSS">
        <img src="/badges/4x3_fade.gif" width="88" height="31" alt="Designed for a 4:3 display">
        <img src="/badges/anybrowser2.gif" width="88" height="31" alt="Viewable with any browser">
      </div>
      <address>${escapeHtml(config.author)} Copyright 2005</address>
      <div>Best viewed on 800 &times; 600 display &middot; 16 color compatible</div>
    </footer>
  </div>
</body>
</html>
`;
}

function listingBody(type, entries) {
  const heading = type === "projects" ? "Projects" : "Publications";
  const singular = type === "projects" ? "project" : "publication";
  if (entries.length === 0) {
    return `<table class="empty-table">
  <thead><tr><th>Status</th><th>Information</th></tr></thead>
  <tbody><tr><td>NO RECORDS</td><td>No ${heading.toLowerCase()} have been added yet.</td></tr></tbody>
</table>
<p>Create one with <code>npm run new -- ${singular} your-${singular}</code>.</p>`;
  }

  if (type === "projects") {
    const rows = entries
      .map((entry) => `<tr>
  <td><a href="/projects/${escapeHtml(entry.slug)}/"><strong>${escapeHtml(entry.title)}</strong></a></td>
  <td class="date-cell">${escapeHtml(entry.date)}</td>
  <td>${escapeHtml(entry.summary)}</td>
</tr>`)
      .join("\n");

    return `<div class="table-scroll">
  <table class="record-table">
    <thead><tr><th>Project</th><th>Date</th><th>Description</th></tr></thead>
    <tbody>
${rows}
    </tbody>
  </table>
</div>`;
  }

  const items = entries
    .map((entry) => {
      const when = type === "projects" ? entry.date : entry.year;
      const details = [when, entry.venue].filter(Boolean).map(escapeHtml).join(" &mdash; ");
      return `<li>
  <a href="/${type}/${escapeHtml(entry.slug)}/"><strong>${escapeHtml(entry.title)}</strong></a>
  ${type === "publications" && entry.authors ? `<p class="authors">${escapeHtml(entry.authors)}</p>` : ""}
  ${details ? `<p class="meta">${details}</p>` : ""}
  <p>${escapeHtml(entry.summary)}</p>
</li>`;
    })
    .join("\n");

  return `<ol class="entries">
${items}
</ol>`;
}

function entryBody(type, entry) {
  const rows = [];
  if (entry.date) rows.push(["Date", entry.date]);
  if (entry.year) rows.push(["Year", entry.year]);
  if (entry.authors) rows.push(["Authors", entry.authors]);
  if (entry.venue) rows.push(["Venue", entry.venue]);
  if (entry.url) {
    rows.push(["Link", `<a href="${escapeHtml(entry.url)}">External resource</a>`]);
  }

  const metadata = rows.length
    ? `<dl class="entry-meta">${rows
        .map(([label, value]) => `<dt>${escapeHtml(label)}</dt><dd>${label === "Link" ? value : escapeHtml(value)}</dd>`)
        .join("")}</dl><hr>`
    : "";

  return `<p><a href="/${type}/">&larr; Back to ${type}</a></p>
<h1>${escapeHtml(entry.title)}</h1>
<p><em>${escapeHtml(entry.summary)}</em></p>
${metadata}
${entry.html}`;
}

async function writePage(relativePath, html) {
  const output = path.join(generatedRoot, relativePath);
  await fs.mkdir(path.dirname(output), { recursive: true });
  await fs.writeFile(output, html, "utf8");
}

export async function generateSite() {
  const config = await readConfig();
  const home = await readMarkdown(path.join(contentRoot, "home.md"));
  const cv = await readMarkdown(path.join(contentRoot, "cv.md"));
  const projects = await readCollection("projects");
  const publications = await readCollection("publications");
  await processPhotos(photosSourceRoot, photosOutputRoot);

  await fs.rm(generatedRoot, { recursive: true, force: true });
  await fs.mkdir(generatedRoot, { recursive: true });

  await writePage("index.html", layout({
    config,
    active: "home",
    title: "Home",
    body: home.html
  }));
  await writePage("cv/index.html", layout({
    config,
    active: "cv",
    title: "Curriculum Vitae",
    body: cv.html
  }));
  await writePage("projects/index.html", layout({
    config,
    active: "projects",
    title: "Projects",
    body: listingBody("projects", projects)
  }));
  await writePage("publications/index.html", layout({
    config,
    active: "publications",
    title: "Publications",
    body: listingBody("publications", publications)
  }));

  for (const project of projects) {
    await writePage(`projects/${project.slug}/index.html`, layout({
      config,
      active: "projects",
      title: project.title,
      description: project.summary,
      body: entryBody("projects", project)
    }));
  }
  for (const publication of publications) {
    await writePage(`publications/${publication.slug}/index.html`, layout({
      config,
      active: "publications",
      title: publication.title,
      description: publication.summary,
      body: entryBody("publications", publication)
    }));
  }

  await writePage("404.html", layout({
    config,
    active: "",
    title: "Page not found",
    body: `<h1>404: Page not found</h1>
<p>The requested page does not exist.</p>
<p><a href="/">Return to the homepage</a>.</p>`
  }));
}

export async function getHtmlInputs() {
  const inputs = {};

  async function visit(directory) {
    for (const item of await fs.readdir(directory, { withFileTypes: true })) {
      const itemPath = path.join(directory, item.name);
      if (item.isDirectory()) {
        await visit(itemPath);
      } else if (item.name.endsWith(".html")) {
        const relative = path.relative(generatedRoot, itemPath);
        inputs[relative.replace(/\.html$/, "")] = itemPath;
      }
    }
  }

  await visit(generatedRoot);
  return inputs;
}

export { contentRoot, generatedRoot, projectRoot };
