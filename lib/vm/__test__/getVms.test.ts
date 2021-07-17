import { getVmHtml } from '../getVmHtml';
import { parse } from 'node-html-parser';
import { parseHTML } from '@lib/scraper';

const ip = '';
const cookie = '';

test('does something', async () => {
  const rawHtml = await getVmHtml(ip, cookie);
  const output = await parseVmHtml(rawHtml);
  expect(output).toBeDefined();
});

async function parseVmHtml(rawHtml: string) {
  // original
  // rawHtml.includes('\u0000')
  const [core, extras] = rawHtml.split('\u0000');
  const details = parseHTML(core);
  console.log({ core });
  const document = parse(core);
  const parents = document.querySelectorAll('[parent-id]');
  const children = document.querySelectorAll('[child-id]');

  const vmdata = parents
    .map((parent) => {
      const id = parent.getAttribute('parent-id');
      const child = children.find((c) => c.getAttribute('child-id') === id);
      return { parent, child };
    })
    .map(({ parent, child }) => {
      // console.log(child.toString());
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
      console.log({ cores });

      return { name, status, imageUrl, id, cores };
    });
  // document.childNodes.forEach((e) => console.log(e.));
  // const object = [];
  // groupVmDetails(details, object);
  // console.log(object[0].parent, object[0].child);
  // const processed = await processVMResponse(details, ip, cookie);
  console.log({ vmdata });
  return '';
}

function groupVmDetails(response: any[], object: any[]) {
  response.forEach((row) => {
    if (row.tags['parent-id']) {
      if (!object[row.tags['parent-id']]) {
        object[row.tags['parent-id']] = {};
      }
      object[row.tags['parent-id']].parent = row;
    } else if (row.tags['child-id']) {
      if (!object[row.tags['child-id']]) {
        object[row.tags['child-id']] = {};
      }
      object[row.tags['child-id']].child = row;
    }
  });
}
