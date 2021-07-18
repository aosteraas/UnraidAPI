import { getUsbHtml } from './getUsbHtml';
import { parseUsbHtml, Usb } from './parseUsbHtml';

export async function fetchUsbs(
  ip: string,
  cookie: string,
  vmId: string,
): Promise<Usb[]> {
  const html = await getUsbHtml(ip, cookie, vmId);
  return parseUsbHtml(html);
}
