import { uploadService } from './upload.service.js';
import { postToStreamingEndpoint } from '../../integrations/model.integration.js';

jest.mock('../../integrations/model.integration.js');

describe('Upload Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call postToStreamingEndpoint with correct parameters and handle chunks', async () => {
    const mockBody = { data: 'test data' };
    const mockOnChunk = jest.fn();
    const mockResponse = { success: true };

    postToStreamingEndpoint.mockImplementation((body, onChunk) => {
      onChunk('chunk1');
      onChunk('chunk2');
      return Promise.resolve(mockResponse);
    });

    const result = await uploadService(mockBody, mockOnChunk);
    expect(postToStreamingEndpoint).toHaveBeenCalledWith(mockBody, mockOnChunk);
    expect(mockOnChunk).toHaveBeenCalledTimes(2);
    expect(mockOnChunk).toHaveBeenNthCalledWith(1, 'chunk1');
    expect(mockOnChunk).toHaveBeenNthCalledWith(2, 'chunk2');
    expect(result).toEqual(mockResponse);
  });
});
