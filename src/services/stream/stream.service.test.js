import { exoplanetClassifier } from './stream.service.js';
import { postToStreamingEndpoint } from '../../integrations/model.integration.js';

jest.mock('../../integrations/gcp/model.integration.js');

describe('exoplanetClassifier function', () => {
    test('should call postToStreamingEndpoint with correct parameters', async () => {
        const endpoint = 'https://example.com/endpoint';
        const dataset = 'testDataset';
        const data = { key: 'value' };
        const onChunk = jest.fn();
        
        // Mock the return value of postToStreamingEndpoint
        postToStreamingEndpoint.mockResolvedValue('responseData');

        const result = await exoplanetClassifier(endpoint, dataset, data, onChunk);

        // Assert that postToStreamingEndpoint was called with correct parameters
        expect(postToStreamingEndpoint).toHaveBeenCalledWith(
            { endpoint, dataset, data },
            onChunk
        );

        // Assert that the result is as expected
        expect(result).toEqual('responseData');
    });

    test('should handle errors from postToStreamingEndpoint', async () => {
        const endpoint = 'https://example.com/endpoint';
        const dataset = 'testDataset';
        const data = { key: 'value' };
        const onChunk = jest.fn();
        postToStreamingEndpoint.mockRejectedValue(new Error('Network Error'));

        await expect(exoplanetClassifier(endpoint, dataset, data, onChunk)).rejects.toThrow('Network Error');
        expect(postToStreamingEndpoint).toHaveBeenCalledWith(
            { endpoint, dataset, data },
            onChunk
        );
    });
});
