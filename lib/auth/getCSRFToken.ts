import { authCookies } from './authCookies';
import { callSucceeded, callFailed } from 'lib/api';
import { extractValue } from 'lib/scraper';
import { unraidApi } from 'lib/unraid';

export async function getCSRFToken(
  server: string,
  auth: string,
): Promise<string> {
  try {
    // todo update this to read from mqtt keys for auth header
    const baseUrl = server.includes('http') ? server : `http://${server}`;
    const cookie = authCookies.get(server) ?? '';

    const response = await unraidApi({
      method: 'GET',
      url: `${baseUrl}/Dashboard`,
      headers: {
        Authorization: `Basic ${auth}`,
        Cookie: cookie,
      },
    });
    callSucceeded(server);
    return extractValue(response.data, 'csrf_token=', "'");
  } catch (e) {
    console.log(`Get CSRF Token for server: ${server} Failed`);
    if (e.response && e.response.status) {
      callFailed(server, e.response.status);
    } else {
      callFailed(server, 404);
    }
    console.log(e.message);
  }
}
