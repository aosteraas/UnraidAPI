import { unraidApi } from '@lib/unraid';

export async function getDockerHtml(
  ip: string,
  cookie: string,
): Promise<string> {
  const url = `${
    ip.includes('http') ? ip : `http://${ip}`
  }/plugins/dynamix.docker.manager/include/DockerContainers.php`;

  const res = await unraidApi.get<string>(url, { headers: { Cookie: cookie } });

  return res.data;
}
