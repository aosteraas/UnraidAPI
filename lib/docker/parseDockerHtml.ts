import { DockerContainer } from '@models/docker';
import { parse } from 'node-html-parser';

export function parseDockerHtml(rawHtml: string): DockerContainer[] {
  const document = parse(rawHtml);

  const rows = document.querySelectorAll('tr.sortable');

  const containers = rows.map((row) => {
    const name = row.querySelector('.appname').firstChild.innerText;
    const imageUrl = row.querySelector('img.img').getAttribute('src');
    const containerId = row.querySelector('.hand').id;
    const status = row.querySelector('.state').innerText;

    const updatecolumn = row.querySelector('.updatecolumn');
    const useLastChild = updatecolumn.childNodes.length === 3;
    const tag = updatecolumn.childNodes[useLastChild ? 2 : 0].textContent;

    return { name, imageUrl, status, containerId, tag };
  });

  return containers;
}
