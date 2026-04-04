const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const sourceDir = path.join(projectRoot, "node_modules", "eventemitter3");
const targetDir = path.join(
  projectRoot,
  "node_modules",
  "recharts",
  "node_modules",
  "eventemitter3"
);

const filesToCopy = ["index.mjs", "index.js", "index.d.ts", "package.json"];

try {
  if (!fs.existsSync(sourceDir)) {
    console.log("[fix-recharts-sourcemap] source package missing, skipping");
    process.exit(0);
  }

  fs.mkdirSync(targetDir, { recursive: true });

  for (const fileName of filesToCopy) {
    const sourceFile = path.join(sourceDir, fileName);
    const targetFile = path.join(targetDir, fileName);

    if (fs.existsSync(sourceFile)) {
      fs.copyFileSync(sourceFile, targetFile);
    }
  }

  console.log("[fix-recharts-sourcemap] eventemitter3 shim created for recharts source maps");
} catch (error) {
  console.error("[fix-recharts-sourcemap] failed:", error.message);
  process.exit(0);
}
