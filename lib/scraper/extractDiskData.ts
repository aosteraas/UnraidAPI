import { VmEditDisk } from 'models/vm';
import { extractReverseValue } from './extractReverseValue';
import { extractValue } from './extractValue';

export function extractDiskData(response: { data: string }): VmEditDisk[] {
  const disks: VmEditDisk[] = [];
  while (response.data.includes('id="disk_')) {
    const row = extractValue(response.data, 'id="disk_', '>');
    const disk = extractValue(row, '', '"');
    const diskselect = extractReverseValue(
      extractValue(
        response.data,
        `<select name="disk[${disk}][select]"`,
        'selected>',
      ),
      "'",
      "value='",
    );
    const diskdriver = extractReverseValue(
      extractValue(
        response.data,
        `<select name="disk[${disk}][driver]"`,
        'selected>',
      ),
      "'",
      "value='",
    );
    const diskbus = extractReverseValue(
      extractValue(
        response.data,
        `<select name="disk[${disk}][bus]"`,
        'selected>',
      ),
      "'",
      "value='",
    );
    const disksize = extractValue(
      response.data,
      `name="disk[${disk}][size]" value="`,
      '"',
    );
    const diskpath = extractValue(row, 'value="', '"');
    if (diskpath) {
      disks.push({
        select: diskselect,
        image: diskpath,
        driver: diskdriver,
        bus: diskbus,
        size: disksize,
      });
    }
    response.data = response.data.replace('id="disk_', '');
  }
  return disks;
}
