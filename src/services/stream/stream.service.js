import { postToStreamingEndpoint } from '../../integrations/model.integration.js';

export const exoplanetClassifier = async (endpoint, dataset, data, onChunk) => {
  return await postToStreamingEndpoint({ endpoint, dataset, data }, onChunk);
};