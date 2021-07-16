import { NextApiResponse } from 'next';
import { getCSRFToken } from '@lib/auth';
import { changeDockerState } from '@lib/docker/changeDockerState';
import { ApiBodyRequest } from '@models/api';

interface DockerBody {
  id: string;
  action: string;
  ip: string;
  auth: string;
}
// changeDockerStatus
async function changeDockerStatus(
  { body }: ApiBodyRequest<DockerBody | undefined>,
  res: NextApiResponse,
): Promise<void> {
  if (!body) {
    res.status(401).send({});
    return;
  }
  const { id, ip, auth, action } = body;
  const token = await getCSRFToken(ip, auth);
  const message = await changeDockerState(id, action, ip, auth, token);

  res.status(200).send({ message });
}

export default changeDockerStatus;
