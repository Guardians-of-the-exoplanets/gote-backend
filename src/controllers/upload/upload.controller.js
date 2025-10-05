import { uploadService } from "../../services/upload/upload.service.js";
import LoggerService from "../../utils/logger/logger.service.js";

export class UploadController {
  static async exoplanetClassifier(req, res) {
    const { mode, dataset } = req.body;
    let { hyperparameters } = req.body;
    const base64 = req.zipBase64;
    let body = {};

    if (!mode && !dataset && !base64) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    body = {
      endpoint: "predict_upload",
      dataset,
      data: base64
    };

    if(hyperparameters) {
      if (typeof hyperparameters === "string") {
        hyperparameters = JSON.parse(hyperparameters);
      }
  
      if (
        typeof hyperparameters === 'object' &&
        !Array.isArray(hyperparameters)
      ) {
        body.hyperparametersData = hyperparameters;
      }
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      await uploadService(
        body,
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

  static async modelRetraining(req, res) {
    const { mode, dataset } = req.body;
    let { hyperparameters } = req.body;
    const base64 = req.zipBase64;
    let body = {}; 

    if (!mode && !dataset && !base64) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    body = {
      endpoint: "retrain",
      dataset,
      data: base64
    };

    if(hyperparameters) {
      if (typeof hyperparameters === "string") {
        hyperparameters = JSON.parse(hyperparameters);
      }
  
      if (
        typeof hyperparameters === 'object' &&
        !Array.isArray(hyperparameters)
      ) {
        body.hyperparametersData = hyperparameters;
      }
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      await uploadService(
       body,
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