import { streamServiceChunk } from '../../services/stream/stream.service.js';

export const streamController = (_, res) => {
  const streamResponse = streamServiceChunk();
  if (streamResponse) {
    res
      .status(200)
      .send({ message: 'Streaming started', data: streamResponse });
  } else {
    res.status(404).send({ message: 'No data received' });
  }
};
