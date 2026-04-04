const fs = require("fs");
const path = require("path");
const https = require("https");

const projectRoot = path.resolve(__dirname, "..");
const modelsDir = path.join(projectRoot, "public", "models");
const baseUrl =
  "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights";

const modelFiles = [
  "ssd_mobilenetv1_model-shard1",
  "ssd_mobilenetv1_model-shard2",
  "ssd_mobilenetv1_model-weights_manifest.json",
  "face_landmark_68_model-shard1",
  "face_landmark_68_model-weights_manifest.json",
  "face_recognition_model-shard1",
  "face_recognition_model-shard2",
  "face_recognition_model-weights_manifest.json",
];

function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      if (
        response.statusCode >= 300 &&
        response.statusCode < 400 &&
        response.headers.location
      ) {
        return resolve(downloadFile(response.headers.location, destination));
      }

      if (response.statusCode !== 200) {
        return reject(new Error(`HTTP ${response.statusCode} for ${url}`));
      }

      const stream = fs.createWriteStream(destination);
      response.pipe(stream);

      stream.on("finish", () => {
        stream.close(resolve);
      });

      stream.on("error", (error) => {
        fs.unlink(destination, () => reject(error));
      });
    });

    request.on("error", reject);
  });
}

async function ensureModels() {
  try {
    fs.mkdirSync(modelsDir, { recursive: true });

    const missingFiles = modelFiles.filter(
      (fileName) => !fs.existsSync(path.join(modelsDir, fileName))
    );

    if (missingFiles.length === 0) {
      console.log("[face-models] all model files already exist");
      return;
    }

    console.log(`[face-models] downloading ${missingFiles.length} model files...`);

    for (const fileName of missingFiles) {
      const url = `${baseUrl}/${fileName}`;
      const destination = path.join(modelsDir, fileName);
      await downloadFile(url, destination);
      console.log(`[face-models] downloaded ${fileName}`);
    }

    console.log("[face-models] model setup complete");
  } catch (error) {
    console.error("[face-models] setup failed:", error.message);
    process.exit(0);
  }
}

ensureModels();
