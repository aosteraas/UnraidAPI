import { unraidApi } from './unraidApi';

export async function getServerMainHtml(
  ip: string,
  cookie: string,
): Promise<string> {
  const url = `${ip.includes('http') ? ip : `http://${ip}`}/Main`;
  const res = await unraidApi.get<string>(url, { headers: { Cookie: cookie } });
  return res.data;
}
