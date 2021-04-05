import { NextApiResponse } from 'next';
import { ApiBodyRequest } from 'models/api';
import { getCSRFToken } from 'lib/auth';
import { changeArrayState } from 'lib/array';

interface ArrayBody {
  server: string;
  auth: string;
  action: string;
}

// changeArrayStatus
async function changeArrayStatus(
  req: ApiBodyRequest<ArrayBody | undefined>,
  res: NextApiResponse,
): Promise<void> {
  if (!req.body) {
    res.status(401).send({});
  }

  const { server, auth, action } = req.body;
  const token = await getCSRFToken(server, auth);
  const message = await changeArrayState(action, server, auth, token);

  res.status(200).send({ message });
}

export default changeArrayStatus;
