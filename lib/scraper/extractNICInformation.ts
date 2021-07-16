import { VmEditNic } from '@models/vm';
import { extractReverseValue } from './extractReverseValue';
import { extractValue } from './extractValue';

export function extractNICInformation(response: { data: string }): VmEditNic[] {
  let nicInfo = extractValue(
    response.data,
    '<table data-category="Network" data-multiple="true"',
    '</table>',
  );
  const nicNo = 0;

  const nics: VmEditNic[] = [];
  while (nicInfo.includes('<td>Network MAC:</td>')) {
    const nic = {
      mac: '',
      network: '',
    };
    nic.mac = extractValue(
      nicInfo,
      `name="nic[${nicNo}][mac]" class="narrow" value="`,
      '"',
    );
    nic.network = extractReverseValue(
      extractValue(nicInfo, `name="nic[${nicNo}][network]"`, 'selected>'),
      "'",
      "value='",
    );
    nics.push(nic);

    nicInfo = nicInfo.replace('<td>Network MAC:</td>', '');
  }
  return nics;
}
