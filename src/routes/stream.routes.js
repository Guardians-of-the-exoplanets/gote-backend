import express from 'express';
import { StreamController } from '../controllers/stream/stream.controller.js';
import { cacheMiddleware } from '../utils/middleware/cache.middleware.js';

const routes = express.Router();

routes.route('/exoplanet').post(cacheMiddleware,  StreamController.exoplanetClassifier);

export default routes;