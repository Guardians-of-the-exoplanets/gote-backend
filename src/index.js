import express from 'express';
import LoggerService from './utils/logger/logger.service.js';
import dotenv from 'dotenv';
import cors from 'cors';

import multer from "multer";

import healthcheckRoutes from './routes/healthcheck.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import streamRoutes from './routes/stream.routes.js';
import { convertCsv } from './utils/middleware/convert-csv.middleware.js';

dotenv.config();

const app = express();
const upload = multer(); 

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/healthcheck', healthcheckRoutes);
app.use('/stream', streamRoutes);
app.use('/upload', upload.single("file"), convertCsv, uploadRoutes);

// Start the server
app.listen(PORT, () => {
  LoggerService.info(`Server is running on Port ${PORT}`);
});
