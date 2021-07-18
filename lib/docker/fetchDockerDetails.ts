import { DockerContainer } from '@models/docker';
import { getDockerHtml } from './getDockerHtml';
import { parseDockerHtml } from './parseDockerHtml';

export async function fetchDockerDetails(
  ip: string,
  cookie: string,
): Promise<DockerContainer[]> {
  const html = await getDockerHtml(ip, cookie);
  const data = parseDockerHtml(html);
  return data;
}
