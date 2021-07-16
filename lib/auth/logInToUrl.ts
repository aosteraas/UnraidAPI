import http from 'http';
import { unraidApi } from '@lib/unraid/unraidApi';
import { authCookies } from '.';

export async function logInToUrl(url: string, data, ip: string): Promise<any> {
  try {
    const resp = await unraidApi({
      url,
      method: 'POST',
      data,
      headers: {
        ...data.getHeaders(),
        'cache-control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      httpAgent: new http.Agent({ keepAlive: true }),
      maxRedirects: 0,
    });
    authCookies.set(ip, resp.headers['set-cookie'][0]);
  } catch (error) {
    if (
      error.response &&
      error.response.headers['set-cookie'] &&
      error.response.headers['set-cookie'][0]
    ) {
      authCookies.set(ip, error.response.headers['set-cookie'][0]);
    } else if (error.response && error.response.headers.location) {
      return logInToUrl(
        error.response.headers.location,
        data,
        error.response.headers.location,
      );
    }
  }
}
