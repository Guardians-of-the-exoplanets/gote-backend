import { streamServiceChunk } from '../../services/stream/stream.service.js';

const streamController = (req, res) => {

  const body = req.body;

  streamServiceChunk(
    body.endpoint || 'health'
  )
    .then((response) => {
      if (response) {
        res.status(200).send({ message: 'Streaming started', data: response });
      } else {
        res.status(404).send({ message: 'No data received' });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: 'Error', error: err });
    });
};

export {
  streamController
};