import { ServerMap } from 'models/server';
import { callSucceeded, callFailed } from 'lib/api';
import { authCookies } from 'lib/auth';
import { parseHTML } from 'lib/scraper';
import { updateFile } from 'lib/storage';
import { processDockerResponse } from './processDockerResponse';
import { unraidApi } from 'lib/unraid';

export function getDockers(
  servers: ServerMap,
  serverAuth: Record<string, string>,
): void {
  // const serverIps = Object.keys(servers);

  Object.keys(servers).forEach((ip) => {
    if (!serverAuth[ip]) {
      return;
    }
    const url = `${
      ip.includes('http') ? ip : `http://${ip}`
    }/plugins/dynamix.docker.manager/include/DockerContainers.php`;

    unraidApi({
      method: 'get',
      url,
      headers: {
        Authorization: `Basic ${serverAuth[ip]}`,
        Cookie: authCookies.get(ip) ?? '',
      },
    })
      .then(async (response) => {
        callSucceeded(ip);
        const htmlDetails = JSON.stringify(response.data);
        const details = parseHTML(htmlDetails);
        if (!servers[ip].docker) {
          servers[ip].docker = {
            details: processDockerResponse(details),
          };
        } else {
          servers[ip].docker.details = processDockerResponse(details);
        }
        updateFile(servers, ip, 'docker');
      })
      .catch((e) => {
        console.log(`Get Docker Details for ip: ${ip} Failed`);
        if (e.response && e.response.status) {
          callFailed(ip, e.response.status);
        } else {
          callFailed(ip, 404);
        }
        console.log(e.message);
      });
  });
}
