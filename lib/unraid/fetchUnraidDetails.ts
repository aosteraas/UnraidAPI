import { authCookies } from '@lib/auth';
import { fetchDockerDetails } from '@lib/docker';
import { fetchVms } from '@lib/vm';
import { ParsedVms } from '@lib/vm/parseVmHtml';
import { DockerContainer } from '@models/docker';
import { ServerMap } from '@models/server';
import { fetchServerDetails } from '.';
import { fetchUsbs } from './fetchUsbs';
import { logIn } from './logIn';
import { ServerCoreDetails } from './parseServerDashboardHtml';
import { Usb } from './parseUsbHtml';
import { ServerMainDetails } from './parseServerMainHtml';
import { readServersNewJson } from '@lib/storage';

export interface UnraidDetails extends ServerCoreDetails, ServerMainDetails {
  ip: string;
  usb: Usb[];
  vms: ParsedVms[];
  extras: string;
  dockers: DockerContainer[];
}

export async function fetchUnraidDetails(
  servers: ServerMap,
  serverAuth: Record<string, string>,
): Promise<UnraidDetails[]> {
  await logIn(servers, serverAuth);
  const _servers = await readServersNewJson();

  const requests = _servers
    .map(({ ip }) => {
      const cookie = authCookies.get(ip);
      return { ip, cookie };
    })
    .filter(hasCookie)
    .map(({ ip, cookie }) => getAllDetails(ip, cookie));

  const responses = await Promise.all(requests);
  return responses;
}

async function getAllDetails(ip: string, cookie: string) {
  const [core, dockers, vms] = await Promise.all([
    fetchServerDetails(ip, cookie),
    fetchDockerDetails(ip, cookie),
    fetchVms(ip, cookie),
  ]);
  const usb: Usb[] = [];

  if (vms.vms[0]?.id) {
    const _usb = await fetchUsbs(ip, cookie, vms.vms[0].id);
    usb.push(..._usb);
  }

  return { ip, ...core, dockers, ...vms, usb };
}

const hasCookie = (data: {
  ip: string;
  cookie?: string;
}): data is { ip: string; cookie: string } => {
  return data.cookie !== undefined;
};
