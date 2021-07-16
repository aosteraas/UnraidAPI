import { NextApiResponse } from 'next';
import { getCSRFToken } from '@lib/auth';
import { ApiBodyRequest } from '@models/api';
import { changeVMState } from '@lib/vm/changeVMState';

interface VmStatusBody {
  id: string;
  action: string;
  ip: string;
  auth: string;
}
// changeVMStatus
async function changeVMStatus(
  { body }: ApiBodyRequest<VmStatusBody>,
  res: NextApiResponse,
): Promise<void> {
  if (!body) {
    res.status(401).send({});
    return;
  }

  const { id, action, ip, auth } = body;
  const token = await getCSRFToken(ip, auth);
  const message = await changeVMState(id, action, ip, auth, token);
  res.status(200).send({ message });
}

export default changeVMStatus;
