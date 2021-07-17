import { unraidApi } from './unraidApi';

export async function getServerDashboardHtml(
  ip: string,
  cookie: string,
): Promise<string> {
  const url = `${ip.includes('http') ? ip : `http://${ip}`}/Dashboard`;
  const res = await unraidApi.get<string>(url, { headers: { Cookie: cookie } });
  return res.data;
}
