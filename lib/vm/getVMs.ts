import { ServerMap, UnraidServer } from '@models/server';
import { callSucceeded, callFailed } from '@lib/api';
import { authCookies } from '@lib/auth';
import { parseHTML } from '@lib/scraper';
import { updateFile } from '@lib/storage';
import { processVMResponse } from './processVMResponse';
import { unraidApi } from '@lib/unraid';
import { VmDetails } from '@models/vm';

async function getVm(
  ip: string,
  auth: string,
): Promise<{
  extras: string;
  details: Record<string, VmDetails>;
}> {
  const urlBase = ip.includes('http') ? ip : `http://${ip}`;

  const resp = await unraidApi({
    method: 'GET',
    url: `${urlBase}/plugins/dynamix.vm.manager/include/VMMachines.php`,
    headers: {
      Authorization: `Basic ${auth}`,
      Cookie: authCookies.get(ip) ?? '',
    },
  });

  const _details: Record<string, VmDetails> = {};
  const vm = {
    extras: '',
    details: _details,
  };

  let htmlDetails: string;

  if (resp.data.toString().includes('\u0000')) {
    const parts = resp.data.toString().split('\u0000');
    htmlDetails = JSON.stringify(parts[0]);

    vm.extras = parts[1];
  } else {
    htmlDetails = resp.data.toString();
  }

  const details = parseHTML(htmlDetails);
  vm.details = await processVMResponse(details, ip, auth);
  return vm;
  // updateFile(servers, ip, 'vm');
}

export async function getVMs(
  servers: ServerMap,
  serverAuth: Record<string, string>,
): Promise<UnraidServer[]> {
  const ips = Object.keys(servers).filter((ip) => serverAuth[ip] !== undefined);
  ips.map((ip) => {
    const auth = serverAuth[ip];
  });
  const all = Object.keys(servers).map(async (ip) => {
    if (!serverAuth[ip]) {
      return;
    }
    const urlBase = ip.includes('http') ? ip : `http://${ip}`;
    const res = await unraidApi({
      method: 'GET',
      url: `${urlBase}/plugins/dynamix.vm.manager/include/VMMachines.php`,
      headers: {
        Authorization: `Basic ${serverAuth[ip]}`,
        Cookie: authCookies.get(ip) ?? '',
      },
    });
    let htmlDetails: string;
    callSucceeded(ip);
    servers[ip].vm = {
      extras: '',
      details: {},
    };
    if (res.data.toString().includes('\u0000')) {
      const parts = res.data.toString().split('\u0000');
      htmlDetails = JSON.stringify(parts[0]);

      servers[ip].vm.extras = parts[1];
    } else {
      htmlDetails = res.data.toString();
    }
    const details = parseHTML(htmlDetails);
    servers[ip].vm.details = await processVMResponse(
      details,
      ip,
      serverAuth[ip],
    );
    return servers[ip];
    // .catch((e) => {
    //   console.log(`Get VM Details for ip: ${ip} Failed`);
    //   if (e.response && e.response.status) {
    //     callFailed(ip, e.response.status);
    //   } else {
    //     callFailed(ip, 404);
    //   }
    //   console.log(e.message);
    // });
  });
  return await Promise.all(all);
}
