import path from "node:path";
import { defineConfig } from "vite";
import {
  contentRoot,
  generateSite,
  generatedRoot,
  getHtmlInputs,
  projectRoot
} from "./scripts/site-generator.mjs";

await generateSite();

function markdownSitePlugin() {
  return {
    name: "markdown-site",
    configureServer(server) {
      const watched = [
        contentRoot,
        path.join(projectRoot, "site.config.json")
      ];
      server.watcher.add(watched);

      let timer;
      const regenerate = (changedPath) => {
        const relevant =
          changedPath.startsWith(contentRoot) ||
          changedPath === path.join(projectRoot, "site.config.json");
        if (!relevant) return;

        clearTimeout(timer);
        timer = setTimeout(async () => {
          try {
            await generateSite();
            server.ws.send({ type: "full-reload" });
            server.config.logger.info("Markdown content regenerated.");
          } catch (error) {
            server.config.logger.error(error.stack || error.message);
          }
        }, 75);
      };

      server.watcher.on("add", regenerate);
      server.watcher.on("change", regenerate);
      server.watcher.on("unlink", regenerate);
    }
  };
}

export default defineConfig({
  root: generatedRoot,
  base: "/",
  publicDir: path.join(projectRoot, "public"),
  plugins: [markdownSitePlugin()],
  build: {
    outDir: path.join(projectRoot, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: await getHtmlInputs()
    }
  },
  preview: {
    port: 4173
  }
});
