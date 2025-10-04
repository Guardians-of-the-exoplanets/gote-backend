export async function postToStreamingEndpoint() {
  const response = await fetch(process.env.CLOUD_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ endpoint: "predict" })
  });

  // response.body é um ReadableStream
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  const chuncks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    // value é um Uint8Array
    const chunk = decoder.decode(value);
    chuncks.push(chunk);
    console.log("Received chunk:", chunk);
  }
  return chuncks.join("");
}