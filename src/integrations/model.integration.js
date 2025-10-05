import LoggerService from '../utils/logger/logger.service.js';

export async function postToStreamingEndpoint(modelData, onChunk) {
  const url = process.env.CLOUD_RUN_URL;
  const body = modelData;

  if (modelData.data.hyperparameters) {
    body.hyperparameters = modelData.data.hyperparameters;
    delete modelData.data.hyperparameters;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then((res) => res).catch((error) => {
    LoggerService.error('Error in fetch to Cloud Run:', error);
    throw error;
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    if (onChunk) onChunk(chunk);
  }
}

