const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");

const app = express();
app.use(cors());

// יצירת תיקיית uploads אם לא קיימת
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const upload = multer({ dest: uploadDir });

// העלאת קובץ והמרה ל-PDF עם RTL בדיוק כמו המקור
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const inputPath = req.file.path;
  const outputFileName = req.file.filename + ".pdf";
  const outputPath = path.join(uploadDir, outputFileName);

  // נתיב ל-soffice.exe
  const sofficePath = "C:\\Program Files\\LibreOffice\\program\\soffice.exe";

  // פקודת CLI להמרה
  execFile(
    sofficePath,
    ["--headless", "--convert-to", "pdf", inputPath, "--outdir", uploadDir],
    (err, stdout, stderr) => {
      if (err) {
        console.error("Conversion error:", err, stderr);
        return res.status(500).json({ message: "Failed to convert DOCX to PDF" });
      }

      console.log("Converted PDF saved to:", outputPath);

      res.json({
        message: "Converted successfully",
        pdf: `uploads/${outputFileName}`,
      });
    }
  );
});

// מאפשר לגשת לקבצים ב-uploads
app.use("/uploads", express.static(uploadDir));

app.listen(5000, () => console.log("Server running on port 5000"));
