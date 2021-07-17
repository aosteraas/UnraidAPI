import { parse } from 'node-html-parser';
import { mainHtml } from './data';
import { getServerMainHtml } from '../getServerMainHtml';

test('Parses server main html', async () => {
  const res = parseServerMainHtml(mainHtml);

  expect(res).toBeDefined();
});

function parseServerMainHtml(rawHtml: string) {
  //
  const document = parse(rawHtml);
  return '';
}
