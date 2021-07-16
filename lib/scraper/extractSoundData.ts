import { SoundPciDetail } from '@models/pci';
import { extractValue } from './extractValue';

export function extractSoundData(response: { data: string }, vmObject): void {
  let soundInfo = extractValue(response.data, '<td>Sound Card:</td>', '</td>');
  while (soundInfo.includes("<option value='")) {
    const row = extractValue(soundInfo, "<option value='", '>');
    const soundCard: SoundPciDetail = {
      id: row.substring(0, row.indexOf("'")),
      sound: true,
      name: extractValue(
        extractValue(soundInfo, "<option value='", '/option>'),
        '>',
        '<',
      ),
      checked: row.includes('selected'),
    };

    vmObject.edit.pcis.push(soundCard);

    soundInfo = soundInfo.replace("<option value='", '');
  }
}
