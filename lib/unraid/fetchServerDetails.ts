import { getServerDashboardHtml } from './getServerDashboardHtml';
import { getServerMainHtml } from './getServerMainHtml';
import {
  parseServerDashboardHtml,
  ServerCoreDetails,
} from './parseServerDashboardHtml';
import { parseServerMainHtml, ServerMainDetails } from './parseServerMainHtml';

export async function fetchServerDetails(
  ip: string,
  cookie: string,
): Promise<ServerCoreDetails & ServerMainDetails> {
  const [dashboardHHtml, mainhthml] = await Promise.all([
    getServerDashboardHtml(ip, cookie),
    getServerMainHtml(ip, cookie),
  ]);

  const dashboard = parseServerDashboardHtml(dashboardHHtml);
  const main = parseServerMainHtml(mainhthml);
  return { ...dashboard, ...main };
}
