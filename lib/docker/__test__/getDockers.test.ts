import { parseDockerHtml } from '../parseDockerHtml';
import { getDockerHtml } from '../getDockerHtml';

const ip = '';
const cookie = '';

test('maybe it will work', async () => {
  const dockerHtml = await getDockerHtml(ip, cookie);
  const res = parseDockerHtml(dockerHtml);
  expect(res).toBeDefined();
});
