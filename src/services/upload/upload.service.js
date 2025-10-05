import { postToStreamingEndpoint } from '../../integrations/model.integration.js';

export const uploadService = async (body, onChunk) => {
  return await postToStreamingEndpoint( body , onChunk);
};