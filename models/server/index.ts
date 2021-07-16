import { Docker } from '@models/docker';
import { PciDetail } from '@models/pci';
import { UsbDetail } from '@models/usb';
import { Vm } from '@models/vm';

export interface ServerDetails {
  arrayStatus?: string;
  arrayProtection?: string;
  moverRunning?: boolean;
  parityCheckRunning?: boolean;
  title?: string;
  cpu?: string;
  memory?: string;
  motherboard?: string;
  diskSpace?: string;
  version?: string;
  arrayUsedSpace?: string;
  arrayTotalSpace?: string;
  arrayFreeSpace?: string;
  on?: boolean;
}

export interface UnraidServer {
  vm?: Vm;
  docker?: Docker;
  serverDetails?: ServerDetails;
  pciDetails?: PciDetail[];
  status?: string;
  usbDetails?: UsbDetail[];
  ip?: string;
}

export interface ServerMap {
  [key: string]: UnraidServer;
}
