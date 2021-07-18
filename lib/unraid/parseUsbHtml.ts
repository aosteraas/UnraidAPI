import { parse } from 'node-html-parser';

export interface Usb {
  id: string;
  name: string;
}

export function parseUsbHtml(rawHtml: string): Usb[] {
  const document = parse(rawHtml);
  const data = document.querySelectorAll('label[for^="usb"]').map((s) => {
    const name = s.innerText;
    const id = s.querySelector('input').getAttribute('value');
    return { name, id };
  });
  return data;
}
