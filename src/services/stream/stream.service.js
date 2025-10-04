import LoggerService from '../../utils/logger/logger.service.js';
import { postToStreamingEndpoint } from '../../integrations/gcp/cloud.run.js';

export const streamServiceChunk = async () => {
  try {
    const streamResponse = await postToStreamingEndpoint();
    return streamResponse;
  } catch (err) {
    LoggerService.error(err);
    throw err;
  }
};
