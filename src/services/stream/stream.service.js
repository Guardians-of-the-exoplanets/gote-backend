import { postToStreamingEndpoint } from '../../integrations/gcp/cloud.run.js';

export const exoplanetClassifier = async (endpoint, dataset, data, onChunk) => {
  return await postToStreamingEndpoint({ endpoint, dataset, data }, onChunk);
};