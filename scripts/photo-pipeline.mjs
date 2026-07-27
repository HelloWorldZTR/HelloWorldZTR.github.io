import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const supportedExtensions = new Set([
  ".avif",
  ".jpeg",
  ".jpg",
  ".png",
  ".tif",
  ".tiff",
  ".webp"
]);

function slugify(filename) {
  return path
    .basename(filename, path.extname(filename))
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function processPhotos(sourceRoot, outputRoot) {
  await fs.mkdir(sourceRoot, { recursive: true });
  await fs.mkdir(outputRoot, { recursive: true });

  const manifestPath = path.join(outputRoot, "manifest.json");
  let previousManifest = [];
  try {
    previousManifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
    if (!Array.isArray(previousManifest)) previousManifest = [];
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw new Error(`Cannot read ${manifestPath}: ${error.message}`);
    }
  }

  const files = (await fs.readdir(sourceRoot))
    .filter((file) => supportedExtensions.has(path.extname(file).toLowerCase()))
    .sort((left, right) => left.localeCompare(right));

  const usedSlugs = new Set();
  const manifestByOutput = new Map(
    previousManifest.map((entry) => [entry.output, entry])
  );

  for (const file of files) {
    const slug = slugify(file);
    if (!slug) {
      throw new Error(`Photo filename "${file}" needs at least one Latin letter or number.`);
    }
    if (usedSlugs.has(slug)) {
      throw new Error(`Photo filenames produce the same output slug: "${slug}.jpg".`);
    }
    usedSlugs.add(slug);

    const inputPath = path.join(sourceRoot, file);
    const outputName = `${slug}.jpg`;
    const outputPath = path.join(outputRoot, outputName);

    const result = await sharp(inputPath, { failOn: "warning" })
      .rotate()
      .resize({
        width: 640,
        height: 480,
        fit: "inside",
        withoutEnlargement: true,
        kernel: sharp.kernel.mitchell
      })
      .modulate({
        brightness: 1,
        saturation: 0.95
      })
      .recomb([
        [1.005, 0, 0],
        [0, 1.003, 0],
        [0, 0, 0.985]
      ])
      .blur(0.3)
      .jpeg({
        quality: 65,
        chromaSubsampling: "4:2:0",
        progressive: false,
        optimiseCoding: true
      })
      .toFile(outputPath);

    const outputStat = await fs.stat(outputPath);
    const entry = {
      source: file,
      output: `/photos/${outputName}`,
      width: result.width,
      height: result.height,
      bytes: outputStat.size
    };
    manifestByOutput.set(entry.output, entry);
  }

  const manifest = [...manifestByOutput.values()]
    .sort((left, right) => left.output.localeCompare(right.output));

  await fs.writeFile(
    manifestPath,
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );

  return manifest;
}
