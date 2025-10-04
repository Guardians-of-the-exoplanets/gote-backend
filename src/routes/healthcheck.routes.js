// routes/userRoutes.js
import express from 'express';
import { healthcheckController } from '../controllers/healthcheck/healthcheck.controller.js';

const routes = express.Router();

routes.route('/').get(healthcheckController);

export default routes;