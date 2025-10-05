import express from 'express';

import { UploadController } from '../controllers/upload/upload.controller.js';

const routes = express.Router();

routes.route('/exoplanet').post(UploadController.exoplanetClassifier);
routes.route('/model').post(UploadController.modelRetraining);

export default routes;