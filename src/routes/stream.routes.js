import express from 'express';
import { streamController } from '../controllers/stream/stream.controller.js';
import { convertCsv } from '../utils/middleware/convert-csv.middleware.js';

const routes = express.Router();

routes.route('/exoplanet').post(streamController, convertCsv);

export default routes;