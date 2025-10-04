import archiver from "archiver";
import { Readable } from "stream";

export const convertCsv = (req, res, next) => {
  try {
    console.log("req middle", req.file);
    if(!req.file) {
      return res.status(400).json({ error: "No file sent" });
    }

    const archive = archiver("zip", { zlib: { level: 9 } });
    const chunks = [];

    archive.on("data", (chunk) => chunks.push(chunk));

    archive.on("end", () => {
      const buffer = Buffer.concat(chunks);
      console.log("buffer", buffer);
      req.zipBase64 = buffer.toString("base64");
      next();
    });

    archive.on("error", (err) => {
      next(err);
    });

    const csvStream = Readable.from(req.file.buffer);
    archive.append(csvStream, { name: req.file.originalname });
    archive.finalize();

  } catch (error) {
    next(error);
  }
};