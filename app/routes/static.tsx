import type { LoaderFunction } from '@remix-run/node';
import fs from 'fs/promises';
import mime from 'mime-types';

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  // Use string concatenation instead of path.join
  const filePath = process.cwd() + '/public' + url.pathname;

  try {
    const file = await fs.readFile(filePath);
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';

    return new Response(file, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    return new Response('Not Found', { status: 404 });
  }
};
