import axios from 'axios';
import { parseServers } from 'lib/storage/servers';
import { VmDetails, VmEdit } from 'models/vm';
import { callSucceeded, callFailed } from '../api';
import { authCookies } from '../auth';
import { extractVMDetails } from '../scraper/extractVMDetails';

export async function gatherDetailsFromEditVM(
  ip: string,
  id: string | number,
  vmObject: VmDetails | undefined,
  auth: string,
): Promise<VmDetails> {
  let servers = await parseServers();
  if (!vmObject) {
    vmObject = servers[ip].vm.details[id];
  }
  try {
    const urlBase = ip.includes('http') ? ip : `http://${ip}`;
    const response = await axios({
      method: 'GET',
      url: `${urlBase}/VMs/UpdateVM?uuid=${id}`,
      headers: {
        Authorization: `Basic ${auth}`,
        Cookie: authCookies.get(ip) ?? '',
      },
    });
    callSucceeded(ip);
    return extractVMDetails(vmObject, response, ip);
  } catch (e) {
    console.log(`Get VM Edit details for ip: ${ip} Failed`);
    if (e.response && e.response.status) {
      callFailed(ip, e.response.status);
    } else {
      callFailed(ip, 404);
    }
    console.log(e.message);
    vmObject.edit = servers[ip].vm.details[id].edit;
    return vmObject;
  }
}
