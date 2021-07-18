import { ServerMap, UnraidServer } from '@models/server';
import { callSucceeded, callFailed } from '@lib/api';
import { authCookies } from '@lib/auth';
import { parseHTML } from '@lib/scraper';
import { processDockerResponse } from './processDockerResponse';
import { unraidApi } from '@lib/unraid';

export async function getDockers(
  servers: ServerMap,
  serverAuth: Record<string, string>,
): Promise<UnraidServer[]> {
  // const serverIps = Object.keys(servers);

  const all = Object.keys(servers).map(async (ip) => {
    if (!serverAuth[ip]) {
      return;
    }
    const url = `${
      ip.includes('http') ? ip : `http://${ip}`
    }/plugins/dynamix.docker.manager/include/DockerContainers.php`;

    const res = await unraidApi({
      method: 'get',
      url,
      headers: {
        Authorization: `Basic ${serverAuth[ip]}`,
        Cookie: authCookies.get(ip) ?? '',
      },
    });
    callSucceeded(ip);
    const htmlDetails = JSON.stringify(res.data);
    const details = parseHTML(htmlDetails);
    if (!servers[ip].docker) {
      servers[ip].docker = {
        details: processDockerResponse(details),
      };
    } else {
      servers[ip].docker.details = processDockerResponse(details);
    }
    return servers[ip];
    // updateFile(servers, ip, 'docker');
    // console.log(`Get Docker Details for ip: ${ip} Failed`);
    // if (e.response && e.response.status) {
    //   callFailed(ip, e.response.status);
    // } else {
    //   callFailed(ip, 404);
    // }
    // console.log(e.message);
  });
  return await Promise.all(all);
}
