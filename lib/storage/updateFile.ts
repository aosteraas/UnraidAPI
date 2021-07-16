import { ServerMap } from '@models/server';
import { parseServers, writeServersJson } from './servers';

export async function updateFile(
  servers: ServerMap,
  ip: string,
  tag: string,
): Promise<void> {
  try {
    const oldServers = await parseServers();
    if (!oldServers[ip]) {
      oldServers[ip] = {};
    }
    oldServers[ip][tag] = servers[ip][tag];
    oldServers[ip].ip = ip;
    await writeServersJson(oldServers);
  } catch (e) {
    console.log(e);
  }
}
