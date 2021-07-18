import { parse } from 'node-html-parser';
import { extractValue } from '@lib/scraper';

export interface ServerMainDetails {
  arrayStatus: string;
  arrayProtection: boolean;
  moverRunning: boolean;
  parityCheckRunning: boolean;
}

export function parseServerMainHtml(rawHtml: string): ServerMainDetails {
  const protection = extractValue(
    rawHtml,
    '</td></tr>\n          <tr><td>',
    '</td><td>',
  );

  const document = parse(rawHtml);

  return {
    arrayProtection: protection.includes('Parity is valid'),
    arrayStatus: document
      .querySelector('input[name="startState"]')
      .getAttribute('value'),
    moverRunning: rawHtml.includes('Disabled - Mover is running.'),
    parityCheckRunning: rawHtml.includes('Parity-Check in progress.'),
  };
}
