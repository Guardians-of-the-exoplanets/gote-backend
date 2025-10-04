import { postToStreamingEndpoint } from '../../integrations/gcp/cloud.run.js';

export const streamServiceChunk = async (endpoint = 'health') => {
  return await postToStreamingEndpoint(endpoint)
    .then((res) => res)
    .catch((err) => err);
};
