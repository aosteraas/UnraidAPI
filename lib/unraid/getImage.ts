import fetch from 'node-fetch';
import { logIn } from './logIn';
import { authCookies } from '@lib/auth';
import { ServerMap } from '@models/server';
import { readMqttKeys } from '@lib/storage';
import { NextApiResponse } from 'next';

export async function getImage(
  servers: ServerMap,
  res: NextApiResponse,
  path: string,
): Promise<void> {
  const serverAuth = await readMqttKeys();
  await logIn(servers, serverAuth);

  const ips = Object.keys(servers);
  try {
    for (const ip of ips) {
      const urlBase = ip.includes('http') ? ip : `http://${ip}`;

      const response = await fetch(urlBase + path, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${serverAuth[ip]}`,
          Cookie: authCookies.get(ip) ?? '',
          'Content-Type': 'image/png',
        },
      });

      const buff = await response.buffer();

      if (buff.toString().includes('<!DOCTYPE html>')) {
        continue;
      }
      res.setHeader('content-type', 'image/png');
      res.send(buff);
      break;
    }
  } catch (err) {
    console.error(err);
  }
}
