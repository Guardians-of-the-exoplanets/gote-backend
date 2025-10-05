import express from 'express';
import { StreamController } from '../controllers/stream/stream.controller.js';

const routes = express.Router();

routes.route('/exoplanet').post(StreamController.exoplanetClassifier);

export default routes;