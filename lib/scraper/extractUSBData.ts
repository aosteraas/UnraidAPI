import fs from 'fs';
import { extractValue } from './extractValue';
import { UsbDetail } from 'models/usb';

export function extractUSBData(
  response: { data: string },
  vmObject,
  ip: string,
): UsbDetail[] {
  const usbs: UsbDetail[] = [];
  let usbInfo = extractValue(response.data, '<td>USB Devices:</td>', '</td>');
  while (usbInfo.includes('value="')) {
    const row = extractValue(usbInfo, 'value="', ' (');
    const usb: UsbDetail = {
      checked: row.includes('checked'),
      id: row.substring(0, row.indexOf('"')),
      name: row.substring(row.indexOf('/') + 3),
      connected: true,
    };
    usbs.push(usb);

    usbInfo = usbInfo.replace('value="', '');
  }
  const rawdata = fs.readFileSync('config/servers.json').toString();
  const servers = JSON.parse(rawdata);
  let oldUsbs = [];
  if (
    servers[ip].vm &&
    servers[ip].vm.details[vmObject.id] &&
    servers[ip].vm.details[vmObject.id].edit
  ) {
    oldUsbs = servers[ip].vm.details[vmObject.id].edit.usbs;
  }
  if (oldUsbs && oldUsbs.length > usbs.length) {
    oldUsbs.forEach((usb) => {
      if (usbs.filter((usbInner) => usbInner.id === usb.id).length === 0) {
        usb.connected = false;
        usbs.push(usb);
      }
    });
  }
  return usbs;
}
