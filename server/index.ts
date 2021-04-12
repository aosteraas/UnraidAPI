import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { startMQTTClient } from './mqtt/index';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const handle = app.getRequestHandler();

app.prepare().then(() => {
  startMQTTClient();
  createServer((req, res) => {
    let parsedUrl = parse(req.url, true);
    if (parsedUrl.pathname.substring(0, 7) === "/state/" || parsedUrl.pathname.substring(0, 9) === "/plugins/") {
      parsedUrl = parse("/api/image?url=" + req.url, true);
    }

    handle(req, res, parsedUrl);
  }).listen(port, () => {
    console.log('> Ready on http://localhost:3000');
  });
});
