import { postToStreamingEndpoint } from './model.integration.js';

global.fetch = jest.fn(); // Mock global fetch

jest.mock('../utils/logger/logger.service.js');

describe('postToStreamingEndpoint', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should call fetch and return status 200', async () => {
        const modelData = {
            data: {
                hyperparameters: { key: 'value' },
            },
        };
        
        const onChunk = jest.fn();
        const mockResponse = {
            ok: true,
            status: 200,
            body: {
                getReader: jest.fn().mockReturnValue({
                    read: jest.fn().mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('chunk data') })
                        .mockResolvedValueOnce({ done: true }),
                }),
            },
        };

        fetch.mockResolvedValue(mockResponse);

        await postToStreamingEndpoint(modelData, onChunk);

        expect(fetch).toHaveBeenCalledWith(process.env.CLOUD_RUN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: modelData.data,
                hyperparameters: { key: 'value' },
            }),
        });

        expect(onChunk).toHaveBeenCalledWith('chunk data');
    });
});