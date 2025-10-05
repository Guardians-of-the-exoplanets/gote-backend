import { postToStreamingEndpoint } from '../../integrations/gcp/cloud.run.js';

export const uploadService = async (body, onChunk) => {
  return await postToStreamingEndpoint( body , onChunk);
};