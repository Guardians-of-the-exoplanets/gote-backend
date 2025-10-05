import express from 'express';
import request from 'supertest';
import { StreamController } from './stream.controller.js'; // Adjust the path as necessary
import { exoplanetClassifier } from '../../services/stream/stream.service.js';

jest.mock('../../services/stream/stream.service.js');

const app = express();
app.use(express.json());
app.post('/exoplanet', StreamController.exoplanetClassifier);

describe('StreamController.exoplanetClassifier', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return 400 if required fields are missing', async () => {
        const response = await request(app).post('/exoplanet').send({});
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    test('should return 400 if mandatory data for k2 is missing', async () => {
        const response = await request(app).post('/exoplanet').send({
            mode: 'test',
            dataset: 'k2',
            data: { sy_pnum: null, soltype: null },
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Missing mandatory data' });
    });

    test('should return 400 if mandatory data for keppler is missing', async () => {
        const response = await request(app).post('/exoplanet').send({
            mode: 'test',
            dataset: 'keppler',
            data: { koi_fpflag_ss: null, koi_model_snr: null },
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Missing mandatory data' });
    });

     test('should return 400 if mandatory data for tess is missing', async () => {
        const response = await request(app).post('/exoplanet').send({
            mode: 'test',
            dataset: 'tess',
            data: { st_tmag: null, pl_tranmid: null, pl_tranmiderr2: null },
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Missing mandatory data' });
    });

    test('should call exoplanetClassifier and stream data', async () => {
        const mockData = {
            sy_pnum: 1,
            soltype: 'G',
            pl_orbper: 365,
            koi_fpflag_ss: 0,
            koi_fpflag_nt: 0,
            koi_fpflag_co: 0,
            koi_fpflag_ec: 0,
            koi_model_snr: 10,
            koi_prad: 1.0,
        }
        const mockStreamData = 'chunk data';
        
        exoplanetClassifier.mockImplementation((mode, dataset, data, onChunk) => {
            onChunk(mockStreamData);
            return Promise.resolve();
        });

        const response = await request(app)
            .post('/exoplanet')
            .send({
                mode: 'test',
                dataset: 'k2',
                data: mockData,
            });

        expect(exoplanetClassifier).toHaveBeenCalled();
        expect(exoplanetClassifier).toHaveBeenCalledTimes(1);
        expect(response.text).toBe(
            `data: ${mockStreamData}\n\nevent: done\ndata: end of stream\n\n`
        );
        expect(response.header['content-type']).toBe('text/event-stream');
        expect(response.status).toBe(200);
    });

    test('should handle errors from exoplanetClassifier', async () => {
        const mockData = { key: 'value' };
        exoplanetClassifier.mockImplementation(() => {
            throw new Error('Classifier error');
        });

        const response = await request(app)
            .post('/exoplanet')
            .send({
                mode: 'test',
                dataset: 'k2',
                data: mockData,
            });

        expect(response.status).toBe(400);
        expect(response.text).toContain('{\"error\":\"Missing mandatory data\"}');
    });

    test('should return 400 if mandatory data from keppler is missing', async () => {
        const response = await request(app).post('/exoplanet').send({
            mode: 'test',
            dataset: 'keppler',
            data: { koi_fpflag_ss: null, koi_model_snr: null },
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Missing mandatory data' });
    });

    test('should include hyperparameters if provided', async () => {
        const mockData = {
            sy_pnum: 1,
            soltype: 'G',
            pl_orbper: 365,
            koi_fpflag_ss: 0,
            koi_fpflag_nt: 0,
            koi_fpflag_co: 0,
            koi_fpflag_ec: 0,
            koi_model_snr: 10,
            koi_prad: 1.0,
        };
        const hyperparameters = { param1: 'value1' };

        exoplanetClassifier.mockImplementation((mode, dataset, data, onChunk) => {
            expect(data.hyperparametersData).toEqual(hyperparameters);
            onChunk('chunk data');
            return Promise.resolve();
        });

        const response = await request(app)
            .post('/exoplanet')
            .send({
                mode: 'test',
                dataset: 'k2',
                data: mockData,
                hyperparameters,
            });

        expect(exoplanetClassifier).toHaveBeenCalled();
        expect(response.status).toBe(200);
    });
});
