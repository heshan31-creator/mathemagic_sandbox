#!/usr/bin/env node

/**
 * scripts/check-translations.js
 *
 * Pre-build guard: fails the build if any file under `content/` still
 * contains the placeholder marker used to flag machine-assisted Sinhala/
 * Tamil strings that have not yet been reviewed by a native speaker.
 *
 * Uses only Node's built-in `fs` and `path` modules (no `grep`, no shell,
 * no third-party packages) so it behaves identically on Windows (local
 * dev) and Linux (Cloudflare CI).
 */

const fs = require("fs");
const path = require("path");

const CONTENT_DIR = path.join(process.cwd(), "content");
const TARGET_STRING = "needs native speaker review";
const SCANNED_EXTENSIONS = new Set([".ts", ".mdx"]);

/**
 * Recursively collects every file under `dir` whose extension is in
 * SCANNED_EXTENSIONS. Returns absolute paths.
 */
function collectFiles(dir) {
  let results = [];

  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    // Directory missing entirely — nothing to scan, not a failure.
    if (err && err.code === "ENOENT") return results;
    throw err;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results = results.concat(collectFiles(fullPath));
    } else if (entry.isFile() && SCANNED_EXTENSIONS.has(path.extname(entry.name))) {
      results.push(fullPath);
    }
  }

  return results;
}

function main() {
  const files = collectFiles(CONTENT_DIR);
  const offendingFiles = [];

  for (const filePath of files) {
    const contents = fs.readFileSync(filePath, "utf8");
    if (contents.includes(TARGET_STRING)) {
      offendingFiles.push(filePath);
    }
  }

  if (offendingFiles.length > 0) {
    console.error("");
    console.error("========================================================");
    console.error(" BUILD BLOCKED: unreviewed translation placeholder found");
    console.error("========================================================");
    console.error("");
    console.error(
      `Found the marker "${TARGET_STRING}" in ${offendingFiles.length} file(s). ` +
        "This marks Sinhala/Tamil content that has not yet been approved by a " +
        "native-speaking reviewer, and must not reach production."
    );
    console.error("");
    for (const filePath of offendingFiles) {
      console.error(`  -> ${filePath}`);
    }
    console.error("");
    console.error("Fix: have a native speaker review the flagged content, then remove");
    console.error(`the "${TARGET_STRING}" marker comment before rebuilding.`);
    console.error("");
    process.exit(1);
  }

  console.log(`✓ Translation check passed — no "${TARGET_STRING}" markers found under content/.`);
  process.exit(0);
}

main();