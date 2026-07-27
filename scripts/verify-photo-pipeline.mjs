import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { processPhotos } from "./photo-pipeline.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), "homepage-photo-check-"));
const sourceRoot = path.join(temporaryRoot, "source");
const outputRoot = path.join(temporaryRoot, "output");

try {
  await fs.mkdir(sourceRoot, { recursive: true });
  const sourcePath = path.join(sourceRoot, "Camera Test.JPG");
  const originalPath = path.join(projectRoot, "public", "images", "avatar.jpg");
  await fs.copyFile(originalPath, sourcePath);

  const originalStat = await fs.stat(sourcePath);
  const manifest = await processPhotos(sourceRoot, outputRoot);
  if (manifest.length !== 1 || manifest[0].output !== "/photos/camera-test.jpg") {
    throw new Error("Photo pipeline did not create the expected manifest entry.");
  }

  const outputPath = path.join(outputRoot, "camera-test.jpg");
  const outputStat = await fs.stat(outputPath);
  const metadata = await sharp(outputPath).metadata();
  if ((metadata.width ?? 0) > 640 || (metadata.height ?? 0) > 480) {
    throw new Error("Processed photo exceeds the 640x480 size limit.");
  }
  if (outputStat.size >= originalStat.size) {
    throw new Error("Processed photo was not smaller than the original test image.");
  }

  await fs.unlink(sourcePath);
  const manifestAfterDeletion = await processPhotos(sourceRoot, outputRoot);
  await fs.access(outputPath);
  if (
    manifestAfterDeletion.length !== 1 ||
    manifestAfterDeletion[0].output !== "/photos/camera-test.jpg"
  ) {
    throw new Error("Deleting a source photo cascaded to its generated output.");
  }

  console.log(
    `Verified photo pipeline: ${metadata.width}x${metadata.height}, ` +
    `${originalStat.size} -> ${outputStat.size} bytes, retained after source deletion.`
  );
} finally {
  await fs.rm(temporaryRoot, { recursive: true, force: true });
}
