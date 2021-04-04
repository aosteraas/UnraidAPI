import { ServerMap } from 'models/server';
import { callSucceeded, callFailed } from 'lib/api';
import { authCookies } from 'lib/auth';
import { parseHTML } from 'lib/scraper';
import { updateFile } from '../storage/updateFile';
import { processVMResponse } from './processVMResponse';
import { unraidApi } from 'lib/unraid';

export function getVMs(servers: ServerMap, serverAuth: Record<string, string>) {
  Object.keys(servers).forEach((ip) => {
    if (!serverAuth[ip]) {
      return;
    }
    const urlBase = ip.includes('http') ? ip : `http://${ip}`;
    unraidApi({
      method: 'GET',
      url: `${urlBase}/plugins/dynamix.vm.manager/include/VMMachines.php`,
      headers: {
        Authorization: `Basic ${serverAuth[ip]}`,
        Cookie: authCookies.get(ip) ?? '',
      },
    })
      .then(async (response) => {
        callSucceeded(ip);
        servers[ip].vm = {
          extras: '',
          details: {},
        };
        let htmlDetails;
        if (response.data.toString().includes('\u0000')) {
          const parts = response.data.toString().split('\u0000');
          htmlDetails = JSON.stringify(parts[0]);

          servers[ip].vm.extras = parts[1];
        } else {
          htmlDetails = response.data.toString();
        }

        const details = parseHTML(htmlDetails);
        servers[ip].vm.details = await processVMResponse(
          details,
          ip,
          serverAuth[ip],
        );
        updateFile(servers, ip, 'vm');
      })
      .catch((e) => {
        console.log(`Get VM Details for ip: ${ip} Failed`);
        if (e.response && e.response.status) {
          callFailed(ip, e.response.status);
        } else {
          callFailed(ip, 404);
        }
        console.log(e.message);
      });
  });
}
