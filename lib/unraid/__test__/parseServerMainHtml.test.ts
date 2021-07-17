import { mainHtml } from './data';
import { parseServerMainHtml } from '../parseServerMainHtml';

test('Parses server main html', async () => {
  const res = parseServerMainHtml(mainHtml);

  expect(res).toMatchSnapshot();
});
