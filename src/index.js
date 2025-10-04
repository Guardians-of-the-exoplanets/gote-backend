import express from 'express';
import healthcheckRouter from './routes/healthcheck.routes.js';
import LoggerService from './utils/logger/logger.service.js';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/healthcheck', healthcheckRouter);

// Start the server
app.listen(PORT, () => {
    LoggerService.info(`Server is running on Port ${PORT}`);
});