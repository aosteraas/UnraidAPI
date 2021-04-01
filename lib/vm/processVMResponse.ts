import { simplifyResponse } from './simplifyResponse';
import { groupVmDetails } from './groupVmDetails';

export async function processVMResponse(response, ip: string, auth: string) {
  const object = [];
  groupVmDetails(response, object);
  return await simplifyResponse(object, ip, auth);
}
