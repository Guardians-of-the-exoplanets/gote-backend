import { exoplanetClassifier } from '../../services/stream/stream.service.js';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 100, checkperiod: 320 });

export class StreamController {
  static async exoplanetClassifier(req, res) {
    const { mode, dataset, data, hyperparameters } = req.body;

    if (!mode && !dataset && !data) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (
      dataset === 'k2' &&
      (data.sy_pnum == null || data.soltype == null || data.pl_orbper == null)
    ) {
      return res.status(400).json({ error: 'Missing mandatory data' });
    }

    if (
      dataset === 'keppler' &&
      (data.koi_fpflag_ss == null ||
        data.koi_fpflag_nt == null ||
        data.koi_fpflag_co == null ||
        data.koi_fpflag_ec == null ||
        data.koi_model_snr == null ||
        data.koi_prad == null)
    ) {
      return res.status(400).json({ error: 'Missing mandatory data' });
    }

    if (
      dataset === 'tess' &&
      (data.st_tmag == null || data.pl_tranmid == null || data.pl_tranmiderr2 == null)
    ) {
      return res.status(400).json({ error: 'Missing mandatory data' });
    }

    if (
      hyperparameters &&
      typeof hyperparameters === 'object' &&
      !Array.isArray(hyperparameters)
    ) {
      data.hyperparameters = hyperparameters;
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      await exoplanetClassifier('predict_manual', dataset, data, (chunk) => {
        res.write(`data: ${chunk}\n\n`);
      });

      // TODO: Isolate caching logic into service layer
      cache.set(
        req.locals?.cacheKey, JSON.stringify({ mode, dataset, data, hyperparameters })
      );

      res.write('event: done\ndata: end of stream\n\n');
      res.end();
    } catch (err) {
      res.write(`event: error\ndata: ${err.message}\n\n`);
      res.end();
    }
  }
}
