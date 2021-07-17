import { usbHtml } from './data';
import { parseUsbHtml } from '../parseUsbHtml';

test('Parses USB html', async () => {
  const data = parseUsbHtml(usbHtml);
  expect(data).toMatchInlineSnapshot(`
Array [
  Object {
    "id": "1058:259d",
    "name": " Western Digital Technologies My Passport Ultra (WDBBKD) (1058:259d)",
  },
]
`);
});
