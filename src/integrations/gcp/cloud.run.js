import LoggerService from '../../utils/logger/logger.service.js';

export async function postToStreamingEndpoint() {
  const url = process.env.CLOUD_RUN_URL;
  const data = {
    endpoint: 'predict',
  };

  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(async (response) => {

      LoggerService.info(`Response: ${response.status}`);
      LoggerService.info(`Response Body: ${JSON.stringify(response)}`);
        
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      LoggerService.info(result);
      return result;
    })
    .catch((err) => {
      LoggerService.error(`Error: ${err.message}`);
      throw err;
    });
}
