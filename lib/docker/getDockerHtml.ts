import { unraidApi } from '@lib/unraid';

export async function getDockerHtml(
  ip: string,
  cookie: string,
): Promise<string> {
  const urlBase = ip.includes('http') ? ip : `http://${ip}`;
  const url = `${urlBase}/plugins/dynamix.docker.manager/include/DockerContainers.php`;
  const res = await unraidApi.get<string>(url, { headers: { Cookie: cookie } });
  return res.data;
}
