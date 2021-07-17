import { unraidApi } from './unraidApi';

export async function getUsbHtml(
  ip: string,
  cookie: string,
  vmId: string,
): Promise<string> {
  const urlBase = ip.includes('http') ? ip : `http://${ip}`;
  const basePath = '/VMs/UpdateVM?uuid=';
  const url = `${urlBase}${basePath}${vmId}`;
  const res = await unraidApi.get<string>(url, { headers: { Cookie: cookie } });
  return res.data;
}
