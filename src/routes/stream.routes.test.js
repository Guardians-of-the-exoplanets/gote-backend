import express from 'express';
import request from 'supertest';
import routes from './stream.routes.js'; // Adjust the path as necessary
import { StreamController } from '../controllers/stream/stream.controller.js';

jest.mock('../controllers/stream/stream.controller.js');

const app = express();
app.use(express.json());
app.use(routes);

describe('Routes', () => {
    test('POST /exoplanet should call exoplanetClassifier once', async () => {
        const mockData = { key: 'value' };  // Example data to send

        StreamController.exoplanetClassifier.mockImplementation((req, res) => {
            res.status(200).json({ success: true });
        });

        await request(app)
            .post('/exoplanet')
            .send(mockData);

        expect(StreamController.exoplanetClassifier).toHaveBeenCalledTimes(1);
    });
});
