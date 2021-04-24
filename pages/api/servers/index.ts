import { NextApiRequest, NextApiResponse } from 'next';
import { getUnraidDetails } from 'lib/unraid';
import { parseServers, readMqttKeys } from 'lib/storage';
import { getKeyStorage } from 'lib/config';

// getServers
async function getServers(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  const keyStorage = getKeyStorage();
  const authHeader = req.headers.authorization;
  const servers = await parseServers();
  const response: Record<string, any> = {
    status: 200,
  };

  if (
    (!authHeader ||
      Object.keys(authHeader).length < Object.keys(servers).length) &&
    keyStorage !== 'config'
  ) {
    Object.keys(servers).forEach((ip) => {
      response[ip] = true;
    });
    res.send({ servers: response });
    return;
  }

  response.servers = servers;

  const loadAuth =
    keyStorage === 'config' && (!authHeader || authHeader.length <= 2);
  const auth = loadAuth ? await readMqttKeys() : JSON.parse(authHeader);

  const _servers = await getUnraidDetails(response.servers, auth);

  response.status = 200;
  res.status(200).send({ servers: _servers });
}

export default getServers;
