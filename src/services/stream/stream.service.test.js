import { streamServiceChunk } from '../stream/stream.service.js';
import { postToStreamingEndpoint } from '../../integrations/gcp/cloud.run.js';

jest.mock('../../integrations/gcp/cloud.run.js');

describe('streamServiceChunk', () => {
    it('should return data when postToStreamingEndpoint resolves', async () => {
        // Arrange: Mock the return value of postToStreamingEndpoint
        const mockResponse = { data: 'some data' };
        postToStreamingEndpoint.mockResolvedValue(mockResponse);
        
        // Act: Call the streamServiceChunk function
        const result = await streamServiceChunk();
        
        // Assert: Check if response matches the expected mock response
        expect(result).toEqual(mockResponse);
    });

    it('should return error when postToStreamingEndpoint rejects', async () => {
        // Arrange: Mock the rejected value of postToStreamingEndpoint
        const mockError = new Error('Something went wrong');
        postToStreamingEndpoint.mockRejectedValue(mockError);
        
        // Act: Call the streamServiceChunk function
        const result = await streamServiceChunk();
        
        // Assert: Check if the result equals the mock error
        expect(result).toEqual(mockError);
    });
});