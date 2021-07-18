import { getVmHtml } from './getVmHtml';
import { ParsedVms, parseVmHtml } from './parseVmHtml';

export async function fetchVms(
  ip: string,
  cookie: string,
): Promise<{
  vms: ParsedVms[];
  extras: string;
}> {
  const html = await getVmHtml(ip, cookie);
  const vms = parseVmHtml(html);
  return vms;
}
