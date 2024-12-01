import { type ActionFunctionArgs } from '@remix-run/node';
import axios from 'axios';

function createStream(response: { data: AsyncIterable<Uint8Array> }) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response.data) {
        try {
          const line = decoder.decode(chunk);
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              const text = data.response || '';
              controller.enqueue(encoder.encode(text));
            } catch (e) {
              console.error('Error parsing JSON:', e);
            }
          }
        } catch (error) {
          console.error('Error processing chunk:', error);
        }
      }
      controller.close();
    },
  });

  return new Response(stream);
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const formData = await request.formData();
    const messages = formData.get('messages');

    if (!messages) {
      return new Response(JSON.stringify({ error: 'No messages provided' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const parsedMessages = JSON.parse(messages.toString());
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llama2',
      messages: parsedMessages,
      stream: true
    }, {
      responseType: 'stream'
    });

    return createStream(response);
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Error processing request' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
