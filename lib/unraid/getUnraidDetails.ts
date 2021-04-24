import { getUSBDetails } from './getUSBDetails';
import { logIn } from './logIn';
import { getServerDetails } from './getServerDetails';
import { getDockers } from 'lib/docker';
import { getVMs } from 'lib/vm/getVMs';
import { ServerMap, UnraidServer } from 'models/server';
import { getPCIDetails } from 'lib/pci';
import { writeServersJson } from 'lib/storage';

export async function getUnraidDetails(
  servers: ServerMap,
  serverAuth: Record<string, string>,
): Promise<ServerMap> {
  await logIn(servers, serverAuth);
  const _servers = await getServerDetails(servers, serverAuth);
  const _vms = await getVMs(servers, serverAuth);
  const _dockers = await getDockers(servers, serverAuth);
  const _usb = await getUSBDetails(servers, serverAuth);
  const _pci = await getPCIDetails(servers);

  const __servers = Object.keys(servers).map((ip) => {
    servers[ip].docker = _dockers.find((d) => d.ip === ip).docker;
    servers[ip].vm = _vms.find((d) => d.ip === ip).vm;
    servers[ip].usbDetails = _usb.find((d) => d.ip === ip).usbDetails;
    servers[ip].pciDetails = _pci.find((d) => d.ip === ip).pciDetails;
    servers[ip].serverDetails = _servers.find((s) => s.ip === ip).serverDetails;
    servers[ip].status = _servers.find((s) => s.status).status;
    const _server = servers[ip];
    return {
      [ip]: _server,
    };
  });

  const map = new Map<string, UnraidServer>();

  __servers.forEach((d) => {
    Object.entries(d).map(([k, v]) => {
      map.set(k, v);
    });
  });

  await writeServersJson(Object.fromEntries(map));
  return servers;
}
