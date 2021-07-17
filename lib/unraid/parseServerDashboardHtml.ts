import { extractValue } from '@lib/scraper';
import { parse } from 'node-html-parser';

interface ServerCoreDetails {
  title: string;
  cpu: string;
  memory: string;
  motherboard: string;
  diskSpace: string;
  cacheSpace: string;
  version: string;
}

export function parseServerDashboardHtml(rawHtml: string): ServerCoreDetails {
  const document = parse(rawHtml, {
    blockTextElements: { script: false, noscript: false },
  });
  // need to remove `/Dashboard`
  const title = document.querySelector('title').innerText;
  const cpuRaw = document.querySelector('tr.cpu_view td[colspan=3]');

  // const cpuCol = cpu.querySelector('td[colspan=3]');
  const newLineIdx = cpuRaw.textContent.indexOf('\n');
  const cpu = cpuRaw.textContent.substr(0, newLineIdx);

  const moboRaw = document.querySelector('tr.mb_view td[colspan=3]');
  const moboNewLineIdx = moboRaw.structuredText.indexOf('\n');
  const motherboard = moboRaw.structuredText.substr(0, moboNewLineIdx);

  const memory = extractValue(rawHtml, 'Memory<br><span>', '<');

  // const mem = next.find((x) => x.querySelector('.icon-ram') !== null);
  const [rawCacheSpace, rawDiskSpace] = document
    .querySelectorAll('a[title="Go to disk settings"]')
    .map((d) => d.nextElementSibling.structuredText);

  const cacheSpace = extractCacheDiskDetails(rawCacheSpace);
  const arraySpace = extractArrayDiskDetails(rawDiskSpace);

  return {
    title,
    cpu,
    motherboard,
    memory,
    diskSpace: rawDiskSpace,
    cacheSpace: rawCacheSpace,
    ...cacheSpace,
    ...arraySpace,
    version: 'todo',
  };
  // console.log(data);
  // console.log(ramElementSibling.parentNode);
  // console.log(ramIcon.querySelectorAll('span'));
  // return '';
}

function extractCacheDiskDetails(details: string) {
  const diskDetails = details.split(' used of ');
  const data = {
    cacheUsedSpace: diskDetails[0],
    cacheTotalSpace: diskDetails[1].substring(0, diskDetails[1].indexOf(' (')),
    cacheFreeSpace: '',
  };

  const totalSizeAndDenomination = data.cacheTotalSpace.split(' ');
  const usedSizeAndDenomination = data.cacheUsedSpace.split(' ');
  const usedNumber = parseInt(usedSizeAndDenomination[0]);
  let totalNumber = parseInt(totalSizeAndDenomination[0]);

  if (usedSizeAndDenomination[1] !== totalSizeAndDenomination[1]) {
    totalNumber *= 1024;
  }

  const freeNumber = totalNumber - usedNumber;
  data.cacheFreeSpace = `${freeNumber} ${usedSizeAndDenomination[1]}`;
  return data;
}

function extractArrayDiskDetails(details: string) {
  const diskDetails = details.split(' used of ');
  const data = {
    arrayUsedSpace: diskDetails[0],
    arrayTotalSpace: diskDetails[1].substring(0, diskDetails[1].indexOf(' (')),
    arrayFreeSpace: '',
  };

  const totalSizeAndDenomination = data.arrayTotalSpace.split(' ');
  const usedSizeAndDenomination = data.arrayUsedSpace.split(' ');
  const usedNumber = parseInt(usedSizeAndDenomination[0]);
  let totalNumber = parseInt(totalSizeAndDenomination[0]);

  if (usedSizeAndDenomination[1] !== totalSizeAndDenomination[1]) {
    totalNumber *= 1024;
  }

  const freeNumber = totalNumber - usedNumber;
  data.arrayFreeSpace = `${freeNumber} ${usedSizeAndDenomination[1]}`;
  return data;
}
