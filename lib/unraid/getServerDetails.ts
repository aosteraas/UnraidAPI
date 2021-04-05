import { ServerMap } from 'models/server';
import { scrapeHTML, scrapeMainHTML } from 'lib/scraper';
import { updateFile } from 'lib/storage';

export function getServerDetails(
  servers: ServerMap,
  serverAuth: Record<string, string>,
): void {
  Object.keys(servers).forEach(async (ip) => {
    if (!serverAuth[ip]) {
      servers[ip].serverDetails.on = false;
      return;
    }

    const scrapedDetails = await scrapeHTML(ip, serverAuth);
    const scrapedMainDetails = await scrapeMainHTML(ip, serverAuth);

    const details = {
      ...scrapedDetails,
      ...scrapedMainDetails,
    };
    servers[ip].serverDetails = {
      ...servers[ip].serverDetails,
      ...details,
    };
    servers[ip].ip = ip;

    servers[ip].serverDetails.on = servers[ip].status === 'online';

    updateFile(servers, ip, 'serverDetails');
  });
}
