import { exoplanetClassifier } from "../../services/upload/upload.service.js";

export class UploadController {
  static async exoplanetClassifier(req, res) {
    const { mode, dataset } = req.body;
    const base64 = req.zipBase64;

    if (!mode && !dataset && !base64) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      await exoplanetClassifier(
        "predict_upload",
        dataset,
        base64,
        (chunk) => {
          res.write(`data: ${chunk}\n\n`);
        }
      );

      res.write("event: done\ndata: end of stream\n\n");
      res.end();
    } catch (err) {
      res.write(`event: error\ndata: ${err.message}\n\n`);
      res.end();
    }
  }
}