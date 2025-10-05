import express from 'express';
import LoggerService from './utils/logger/logger.service.js';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import multer from 'multer';

import healthcheckRoutes from './routes/healthcheck.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import streamRoutes from './routes/stream.routes.js';
import { convertCsv } from './utils/middleware/convert-csv.middleware.js';

dotenv.config();

const app = express();
const upload = multer();

const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  undefined
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true); // Origin is allowed
        } else {
            callback(new Error('Not allowed by CORS')); // Origin is not allowed
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['*'],
};

app.use(cors(corsOptions));

app.use('/healthcheck', healthcheckRoutes);
app.use('/stream', streamRoutes);
app.use('/upload', upload.single('file'), convertCsv, uploadRoutes);

// Start the server
app.listen(PORT, () => {
  LoggerService.info(`Server is running on Port ${PORT}`);
});
