import { postToStreamingEndpoint } from '../../integrations/gcp/cloud.run.js';

export const exoplanetClassifier = async (endpoint, dataset, data) => {

  return await postToStreamingEndpoint({endpoint, dataset, data})
    .then((res) => res)
    .catch((err) => err);
};
