export async function postToStreamingEndpoint(modelData, onChunk) {
  const url = process.env.CLOUD_RUN_URL;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(modelData),
  });

  if (!response.ok) throw new Error(`HTTP error! ${response.status}`);

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    if (onChunk) onChunk(chunk);
  }
}

