import express from 'express';
import request from 'supertest';
import { UploadController } from './upload.controller.js'; // Adjust the path as necessary
import { uploadService } from "../../services/upload/upload.service.js"; // Adjust this import as needed

jest.mock('../../services/upload/upload.service.js');

const app = express();
app.use(express.json());
app.post('/exoplanet', UploadController.exoplanetClassifier);
app.post('/retrain', UploadController.modelRetraining);

describe('UploadController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('exoplanetClassifier should return 400 if required fields are missing', async () => {
        const response = await request(app).post('/exoplanet').send({});
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    test('modelRetraining should return 400 if required fields are missing', async () => {
        const response = await request(app).post('/retrain').send({});
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    test('exoplanetClassifier should successfully stream data', async () => {
        const mockData = { key: 'value' };
        const base64Data = 'base64EncodedData';

        uploadService.mockImplementation((body, onChunk) => {
            onChunk('chunk data');
            return Promise.resolve();
        });

        const response = await request(app)
            .post('/exoplanet')
            .send({
                mode: 'test',
                dataset: 'kepler',
                zipBase64: base64Data,
            });

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('text/event-stream');
        expect(uploadService).toHaveBeenCalledTimes(1);
    });

    test('modelRetraining should successfully stream data', async () => {
        const mockData = { key: 'value' };
        const base64Data = 'base64EncodedData';

        uploadService.mockImplementation((body, onChunk) => {
            onChunk('training chunk data');
            return Promise.resolve();
        });

        const response = await request(app)
            .post('/retrain')
            .send({
                mode: 'retrain',
                dataset: 'k2',
                zipBase64: base64Data,
            });

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('text/event-stream');
        expect(uploadService).toHaveBeenCalledTimes(1);
    });

    test('exoplanetClassifier should handle errors from uploadService', async () => {
        const base64Data = 'base64EncodedData';

        uploadService.mockImplementation(() => {
            throw new Error('Upload service error');
        });

        const response = await request(app)
            .post('/exoplanet')
            .send({
                mode: 'test',
                dataset: 'kepler',
                zipBase64: base64Data,
            });

        expect(response.status).toBe(200);
        expect(response.text).toContain('event: error');
        expect(response.text).toContain('data: Upload service error');
    });

    test('modelRetraining should handle errors from uploadService', async () => {
        const base64Data = 'base64EncodedData';

        uploadService.mockImplementation(() => {
            throw new Error('Retraining error');
        });

        const response = await request(app)
            .post('/retrain')
            .send({
                mode: 'retrain',
                dataset: 'k2',
                zipBase64: base64Data,
            });

        expect(response.status).toBe(200);
        expect(response.text).toContain('event: error');
        expect(response.text).toContain('data: Retraining error');
    });

    test('exoplanetClassifier should parse hyperparameters if provided as string', async () => {
        const base64Data = 'base64EncodedData';
        const hyperparameters = JSON.stringify({ param1: 'value1' });

        uploadService.mockImplementation((body, onChunk) => {
            expect(body.hyperparametersData).toEqual({ param1: 'value1' });
            onChunk('chunk data');
            return Promise.resolve();
        });

        const response = await request(app)
            .post('/exoplanet')
            .send({
                mode: 'test',
                dataset: 'kepler',
                zipBase64: base64Data,
                hyperparameters,
            });

        expect(response.status).toBe(200);
        expect(uploadService).toHaveBeenCalledTimes(1);
    });

    test('modelRetraining should parse hyperparameters if provided as string', async () => {
        const base64Data = 'base64EncodedData';
        const hyperparameters = JSON.stringify({ param1: 'value1' });

        uploadService.mockImplementation((body, onChunk) => {
            expect(body.hyperparametersData).toEqual({ param1: 'value1' });
            onChunk('training chunk data');
            return Promise.resolve();
        });

        const response = await request(app)
            .post('/retrain')
            .send({
                mode: 'retrain',
                dataset: 'k2',
                zipBase64: base64Data,
                hyperparameters,
            });

        expect(response.status).toBe(200);
        expect(uploadService).toHaveBeenCalledTimes(1);
    });

    test('modelRetraining should parse hyperparameters if provided as array', async () => {
        const base64Data = 'base64EncodedData';
        const hyperparameters = ['param1=value1', 'param2=value2'];

        uploadService.mockImplementation((body, onChunk) => {
            expect(body.hyperparametersData).toEqual({ param1: 'value1', param2: 'value2' });
            onChunk('training chunk data');
            return Promise.resolve();
        });

        const response = await request(app)
            .post('/retrain')
            .send({
                mode: 'retrain',
                dataset: 'k2',
                zipBase64: base64Data,
                hyperparameters,
            });

        expect(response.status).toBe(200);
        expect(uploadService).toHaveBeenCalledTimes(1);
    });

    test('exoplanetClassifier should parse hyperparameters if provided as array', async () => {
        const base64Data = 'base64EncodedData';
        const hyperparameters = ['param1=value1', 'param2=value2'];

        uploadService.mockImplementation((body, onChunk) => {
            expect(body.hyperparametersData).toEqual({ param1: 'value1', param2: 'value2' });
            onChunk('chunk data');
            return Promise.resolve();
        });

        const response = await request(app)
            .post('/exoplanet')
            .send({
                mode: 'test',
                dataset: 'kepler',
                zipBase64: base64Data,
                hyperparameters,
            });

        expect(response.status).toBe(200);
        expect(uploadService).toHaveBeenCalledTimes(1);
    });

    test('exoplanetClassifier should parse hyperparameters if provided as object', async () => {
        const base64Data = 'base64EncodedData';
        const hyperparameters = { param1: 'value1' };

        uploadService.mockImplementation((body, onChunk) => {
            expect(body.hyperparametersData).toEqual({ param1: 'value1' });
            onChunk('chunk data');
            return Promise.resolve();
        });

        const response = await request(app)
            .post('/exoplanet')
            .send({
                mode: 'test',
                dataset: 'kepler',
                zipBase64: base64Data,
                hyperparameters,
            });

        expect(response.status).toBe(200);
        expect(uploadService).toHaveBeenCalledTimes(1);
    });
});