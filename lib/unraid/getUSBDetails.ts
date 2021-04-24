import { ServerMap, UnraidServer } from 'models/server';
import { callSucceeded, callFailed } from 'lib/api';
import { authCookies } from 'lib/auth';
import { extractValue } from 'lib/scraper';
import { updateFile } from 'lib/storage';
import { unraidApi } from './unraidApi';

export async function getUSBDetails(
  servers: ServerMap,
  serverAuth: Record<string, string>,
): Promise<UnraidServer[]> {
  const all = Object.keys(servers).map(async (ip) => {
    if (!serverAuth[ip]) {
      return;
    }
    if (
      servers[ip].vm &&
      servers[ip].vm.details &&
      Object.keys(servers[ip].vm.details).length > 0
    ) {
      const urlBase = ip.includes('http') ? ip : `http://${ip}`;
      const basePath = '/VMs/UpdateVM?uuid=';
      const res = await unraidApi({
        method: 'get',
        url:
          urlBase +
          basePath +
          servers[ip].vm.details[Object.keys(servers[ip].vm.details)[0]].id,
        headers: {
          Authorization: `Basic ${serverAuth[ip]}`,
          Cookie: authCookies.get(ip) ?? '',
        },
      });
      callSucceeded(ip);
      updateFile(servers, ip, 'status');

      servers[ip].usbDetails = [];
      while (res.data.toString().includes('<label for="usb')) {
        const row = extractValue(res.data, '<label for="usb', '</label>');
        servers[ip].usbDetails.push({
          id: extractValue(row, 'value="', '"'),
          name: extractValue(row, '/> ', ' ('),
        });
        res.data = res.data.replace('<label for="usb', '');
      }
      return servers[ip];
      // updateFile(servers, ip, 'usbDetails');
      // console.log(`Get USB Details for ip: ${ip} Failed`);
      // if (e.response && e.res.status) {
      //   callFailed(ip, e.res.status);
      // } else {
      //   callFailed(ip, 404);
      // }
      // console.log(e.message);
      // if (e.message.includes('ETIMEDOUT')) {
      //   updateFile(servers, ip, 'status');
      // }
    }
  });
  return await Promise.all(all);
}
