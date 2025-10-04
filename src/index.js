import express from 'express';
import LoggerService from './utils/logger/logger.service.js';
import dotenv from 'dotenv';

import healthcheckRoutes from './routes/healthcheck.routes.js';
import streamRoutes from './routes/stream.routes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/healthcheck', healthcheckRoutes);
app.use('/stream', streamRoutes);

// Start the server
app.listen(PORT, () => {
  LoggerService.info(`Server is running on Port ${PORT}`);
});
