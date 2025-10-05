import express from 'express';
import request from 'supertest';
import { healthcheckController } from './healthcheck.controller.js'; // Adjust the path as necessary
import { healthcheck } from '../../services/healthcheck/healthcheck.service.js';

jest.mock('../../services/healthcheck/healthcheck.service.js');

const app = express();
app.get('/', healthcheckController);

describe('healthcheckController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return healthcheck response', async () => {
        const mockResponse = { status: 'healthy' };
        healthcheck.mockReturnValue(mockResponse);

        const response = await request(app).get('/');

        expect(healthcheck).toHaveBeenCalled();
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockResponse);
    });

    test('should handle errors', async () => {
        healthcheck.mockImplementation(() => {
            throw new Error('Service error');
        });
        
        const response = await request(app).get('/');
        expect(healthcheck).toHaveBeenCalled();
        expect(response.status).toBe(500);
        expect(response.body).toEqual({});
    });
});
