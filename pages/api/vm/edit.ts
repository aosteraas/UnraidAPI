import { requestChange } from 'lib/api';
import { getCSRFToken } from 'lib/auth';
import { changeVMState, gatherDetailsFromEditVM } from 'lib/vm';
import { ApiBodyRequest } from 'models/api';
import { NextApiResponse } from 'next';

interface EditVmBody {
  server: string;
  id: string;
  auth: string;
  edit: Record<string, any>;
}

export default async function (
  { body }: ApiBodyRequest<EditVmBody>,
  res: NextApiResponse,
): Promise<void> {
  const message = await editVM(body);

  res.send({ message, status: 200 });
}

async function editVM(data: EditVmBody) {
  const [existingVMObject, token] = await Promise.all([
    gatherDetailsFromEditVM(data.server, data.id, undefined, data.auth),
    getCSRFToken(data.server, data.auth),
  ]);

  Object.keys(data.edit).forEach((key) => {
    existingVMObject.edit[key] = data.edit[key];
  });

  await changeVMState(data.id, 'domain-stop', data.server, data.auth, token);

  const result = await requestChange(
    data.server,
    data.id,
    data.auth,
    existingVMObject.edit,
    false,
  );

  await changeVMState(data.id, 'domain-start', data.server, data.auth, token);

  return result;
}
