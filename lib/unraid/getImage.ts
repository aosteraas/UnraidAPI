import fetch from 'node-fetch';
import { logIn } from './logIn';
import { authCookies } from 'lib/auth';
import { ServerMap } from 'models/server';
import { readMqttKeys } from 'lib/storage';
import { NextApiResponse } from 'next';

export async function getImage(
  servers: ServerMap,
  res: NextApiResponse,
  path: string,
): Promise<void> {
  const serverAuth = await readMqttKeys();
  await logIn(servers, serverAuth);
  let sent = false;

  Object.keys(servers).forEach((server) => {
    const urlBase = server.includes('http') ? server : `http://${server}`;
    const basePath = path.includes('plugins') ? '/state' : '/plugins';
    fetch(urlBase + basePath + path, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${serverAuth[server]}`,
        Cookie: authCookies.get(server) ?? '',
        'Content-Type': 'image/png',
      },
    })
      .then((image) => image.buffer())
      .then((buffer) => {
        if (buffer.toString().includes('<!DOCTYPE html>')) {
          return;
        }
        if (!sent) {
          sent = true;
          try {
            res.setHeader('content-type', 'image/png');
            res.send(buffer);
          } catch (e) {
            console.error(e);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
}
