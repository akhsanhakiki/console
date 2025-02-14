const fs = require("fs");
const path = require("path");

const sourceFile = path.join(
  __dirname,
  "../node_modules/pdfjs-dist/build/pdf.worker.min.js"
);
const targetFile = path.join(__dirname, "../public/pdf.worker.min.js");

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, "../public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// Copy the file
fs.copyFileSync(sourceFile, targetFile);
console.log("PDF worker file copied successfully!");
