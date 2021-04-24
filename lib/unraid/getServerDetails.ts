import { ServerMap, UnraidServer } from 'models/server';
import { scrapeHTML, scrapeMainHTML } from 'lib/scraper';
import { updateFile } from 'lib/storage';

export async function getServerDetails(
  servers: ServerMap,
  serverAuth: Record<string, string>,
): Promise<UnraidServer[]> {
  const res = Object.keys(servers).map(async (ip) => {
    if (!serverAuth[ip]) {
      servers[ip].serverDetails.on = false;
      return;
    }
    const auth = serverAuth[ip];

    const details = await fetchHtml(ip, auth);
    servers[ip].serverDetails = {
      ...servers[ip].serverDetails,
      ...details,
    };

    servers[ip].ip = ip;

    servers[ip].serverDetails.on = servers[ip].status === 'online';
    return servers[ip];
    await updateFile(servers, ip, 'serverDetails');
  });
  return await Promise.all(res);
}

async function fetchHtml(ip: string, auth: string): Promise<any> {
  const [scrapedDetails, scrapedMainDetails] = await Promise.all([
    scrapeHTML(ip, auth),
    scrapeMainHTML(ip, auth),
  ]);

  const details = {
    ...scrapedDetails,
    ...scrapedMainDetails,
  };
  return details;
}
