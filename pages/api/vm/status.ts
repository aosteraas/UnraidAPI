import { NextApiResponse } from 'next';
import { getCSRFToken } from 'lib/auth';
import { ApiBodyRequest } from 'models/api';
import { changeVMState } from 'lib/vm/changeVMState';

interface VmStatusBody {
  id: string;
  action: string;
  server: string;
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

  const { id, action, server, auth } = body;
  const token = await getCSRFToken(server, auth);
  const message = await changeVMState(id, action, server, auth, token);
  res.status(200).send({ message });
}

export default changeVMStatus;
