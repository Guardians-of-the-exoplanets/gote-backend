import express from 'express';
import request from 'supertest';
import routes from './upload.routes.js'; // Adjust the path as necessary
import { UploadController } from '../controllers/upload/upload.controller.js';

jest.mock('../controllers/upload/upload.controller.js');

const app = express();
app.use(express.json());
app.use(routes);

describe('Routes', () => {
    test('POST /exoplanet should call exoplanetClassifier', async () => {
        const mockData = { key: 'value' };
        UploadController.exoplanetClassifier.mockImplementation((req, res) => {
            res.status(200).json({ success: true });
        });

        const response = await request(app)
            .post('/exoplanet')
            .send(mockData);

        expect(UploadController.exoplanetClassifier).toHaveBeenCalled();
        expect(UploadController.exoplanetClassifier).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true });
    });

    test('POST /model should call modelRetraining', async () => {
        const mockData = { key: 'value' };
        UploadController.modelRetraining.mockImplementation((req, res) => {
            res.status(200).json({ success: true });
        });

        const response = await request(app)
            .post('/model')
            .send(mockData);

        expect(UploadController.modelRetraining).toHaveBeenCalled();
        expect(UploadController.modelRetraining).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true });
    });
});
