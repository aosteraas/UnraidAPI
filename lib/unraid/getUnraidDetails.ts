import { getUSBDetails } from './getUSBDetails';
import { logIn } from './logIn';
import { getServerDetails } from './getServerDetails';
import { getDockers } from 'lib/docker';
import { getVMs } from 'lib/vm/getVMs';
import { ServerMap } from 'models/server';
import { getPCIDetails } from 'lib/pci';

export async function getUnraidDetails(
  servers: ServerMap,
  serverAuth: Record<string, string>,
): Promise<void> {
  await logIn(servers, serverAuth);
  getServerDetails(servers, serverAuth);
  getVMs(servers, serverAuth);
  getDockers(servers, serverAuth);
  getUSBDetails(servers, serverAuth);
  getPCIDetails(servers);
}
