import express from 'express';
import request from 'supertest';
import routes from './healthcheck.routes.js'; // Adjust the path as necessary
import { healthcheckController } from '../controllers/healthcheck/healthcheck.controller.js';

jest.mock('../controllers/healthcheck/healthcheck.controller.js');

const app = express();
app.use(routes);

describe('User Routes', () => {
    test('GET / should call healthcheckController once', async () => {
        healthcheckController.mockImplementation((req, res) => {
            res.status(200).json({ status: 'ok' });
        });

        const response = await request(app).get('/');

        expect(healthcheckController).toHaveBeenCalledTimes(1);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
    });
});
