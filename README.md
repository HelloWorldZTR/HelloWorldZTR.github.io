# HelloWorldZTR academic homepage

A small Markdown-driven Vite site for `https://HelloWorldZTR.github.io/`. The generated site uses static HTML, one stylesheet, and no frontend framework. A tiny inline progressive-enhancement script enables the optional CRT treatment only when the browser supports the required JavaScript and CSS APIs; the complete site remains usable without JavaScript.

## Local development

Use Node.js 22:

```sh
npm install
npm run dev
```

Vite prints the local URL. Markdown and site configuration changes are regenerated automatically.

Build and verify the production output:

```sh
npm run check
npm run preview
```

The production files are written to `dist/`.

## Edit the site

General settings live in `site.config.json`. The `description` field accepts trusted inline HTML for the profile panel; because this file is repository-owned content, it is rendered without sanitization.

- Home: `content/home.md`
- CV: `content/cv.md`
- Projects: `content/projects/*.md`
- Publications: `content/publications/*.md`

Create a new entry:

```sh
npm run new -- project my-project
npm run new -- publication my-paper
```

The slug becomes the URL. For example, `my-project.md` is published at `/projects/my-project/`. Slugs may contain lowercase letters, numbers, and single hyphens. Entries are listed newest first.

Project front matter:

```yaml
---
title: "Project title"
date: "2026-07-27"
summary: "A short description."
url: "https://example.com"
---
```

Publication front matter:

```yaml
---
title: "Publication title"
year: "2026"
authors: "Author One, Author Two"
venue: "Venue name"
summary: "A short description."
url: "https://doi.org/example"
---
```

The `url`, `authors`, and `venue` fields may be left empty.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and deploys the site whenever `main` is pushed, or when it is started manually.

For the first deployment:

1. Push `main` to GitHub and make it the repository's default branch if desired.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions** as the source.
4. Run the workflow or push another commit to `main`.

This repository is configured for the root user-site URL, so Vite's base path is `/`. No custom domain or `CNAME` is included.
