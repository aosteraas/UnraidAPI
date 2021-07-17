import { parse } from 'node-html-parser';

interface ParsedVms {
  id: string;
  name: string;
  status: string;
  imageUrl: string;
  cores: string;
  memory: string;
  hddTotal: string;
}

export function parseVmHtml(rawHtml: string): {
  vms: ParsedVms[];
  extras: string;
} {
  const [core, extras] = rawHtml.split('\u0000');

  const document = parse(core);
  const parents = document.querySelectorAll('[parent-id]');
  const children = document.querySelectorAll('[child-id]');

  const vms = parents
    .map((parent) => {
      const id = parent.getAttribute('parent-id');
      const child = children.find((c) => c.getAttribute('child-id') === id);
      return { parent, child };
    })
    .map(({ parent, child }) => {
      const outer = parent.querySelector('.outer');
      const imageUrl = outer.querySelector('img.img').getAttribute('src');
      const id = outer
        .querySelector('.hand')
        .getAttribute('id')
        .replace('vm-', '');

      const inner = parent.querySelector('.inner');
      const name = inner.querySelector('a').innerText;
      const status = inner.querySelector('.state').innerText;
      const cores = parent.querySelector('[class^="vcpu"]*').innerText;
      const memory = parent.childNodes[3].innerText;
      const hddTotal = parent.querySelector('td[title]').innerText;

      return { id, name, status, imageUrl, cores, memory, hddTotal };
    });

  return { vms, extras: extras ?? '' };
}
