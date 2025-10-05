import { exoplanetClassifier } from "../../services/stream/stream.service.js";
export class StreamController {
  static async exoplanetClassifier(req, res) {
    const { mode, dataset, data } = req.body;

    if (!mode && !dataset && !data) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if(dataset === "k2" && (!data.sy_pnum || !data.soltype || !data.pl_orbper)) {
      return res.status(400).json({ error: "Missing mandatory data" });
    }

    if(dataset === "keppler" && (!data.koi_fpflag_ss || !data.koi_fpflag_nt || !data.koi_fpflag_co || !data.koi_fpflag_ec || !data.koi_model_snr || !data.koi_prad)) {
      return res.status(400).json({ error: "Missing mandatory data" });
    }

    // validate tess mandatory data

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      await exoplanetClassifier(
        "predict_manual",
        dataset,
        data,
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