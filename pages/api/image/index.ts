import { NextApiRequest, NextApiResponse } from 'next';
import { getImage } from 'lib/unraid';
import { parseServers } from 'lib/storage/servers';
import { ServerMap } from 'models/server';

async function proxyImage(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  let servers: ServerMap;
  try {
    servers = await parseServers();
    getImage(servers, res, req.body.path);
  } catch (e) {
    console.log('Failed to retrieve config file, creating new.');
  }
  getImage(servers, res, req.body.path);
}

export default proxyImage;