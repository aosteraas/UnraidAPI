import { unraidApi } from '@lib/unraid';

export async function getVmHtml(ip: string, cookie: string): Promise<string> {
  const urlBase = ip.includes('http') ? ip : `http://${ip}`;
  const url = `${urlBase}/plugins/dynamix.vm.manager/include/VMMachines.php`;
  const res = await unraidApi.get<string>(url, { headers: { Cookie: cookie } });
  console.log(res.data);
  return res.data;
}

export async function getVmEditHtml(
  ip: string,
  cookie: string,
  id: string,
): Promise<string> {
  const urlBase = ip.includes('http') ? ip : `http://${ip}`;
  const url = `${urlBase}/VMs/UpdateVM?uuid=${id}`;
  const res = await unraidApi.get<string>(url, { headers: { Cookie: cookie } });
  return res.data;
}
