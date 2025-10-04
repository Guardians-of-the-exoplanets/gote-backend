import { postToStreamingEndpoint } from '../../integrations/gcp/cloud.run.js';

export const streamServiceChunk = async () => {
  return await postToStreamingEndpoint()
    .then((res) => res)
    .catch((err) => err);
};
