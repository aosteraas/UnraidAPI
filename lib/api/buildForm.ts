import { getCSRFToken } from '@lib/auth';
import {
  getCPUPart,
  getStaticPart,
  getUSBPart,
  getDiskPart,
  getNetworkPart,
  getSharePart,
} from '@lib/unraid';
import { getPCIPart } from '@lib/pci';
import { VmEdit } from '@models/vm';

export async function buildForm(
  ip: string,
  auth: string,
  id: string,
  vmObject: VmEdit,
  create: boolean,
): Promise<string> {
  let form = getStaticPart(vmObject, id, create);
  form += `&csrf_token=${await getCSRFToken(ip, auth)}`;
  form = getCPUPart(vmObject, form);
  form = getDiskPart(vmObject, form);
  form = getSharePart(vmObject, form);
  form = getPCIPart(vmObject, form);
  form = getUSBPart(vmObject, form);
  form = getNetworkPart(vmObject, form);
  return form;
}
