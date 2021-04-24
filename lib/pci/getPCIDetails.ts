import { ServerMap, UnraidServer } from 'models/server';
import { updateFile } from 'lib/storage';

export async function getPCIDetails(
  servers: ServerMap,
  skipSave = false,
): Promise<UnraidServer[]> {
  const all = Object.keys(servers).map(async (ip) => {
    if (
      servers[ip].vm &&
      servers[ip].vm.details &&
      Object.keys(servers[ip].vm.details).length > 0 &&
      servers[ip].vm.details[Object.keys(servers[ip].vm.details)[0]].edit
    ) {
      servers[ip].pciDetails =
        servers[ip].vm.details[
          Object.keys(servers[ip].vm.details)[0]
        ].edit.pcis;
    }
    if (!skipSave) {
      // updateFile(servers, ip, 'pciDetails');
    }
    return servers[ip];
  });
  return await Promise.all(all);
}
