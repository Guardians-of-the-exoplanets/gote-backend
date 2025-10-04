import express from 'express';
import { streamController } from '../controllers/stream/stream.controller.js';

const routes = express.Router();

routes.route('/').get(streamController);
export default routes;
