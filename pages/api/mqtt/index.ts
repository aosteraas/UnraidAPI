import { readDisabledDevices, writeDisabledDevices } from '@lib/storage';
import { NextApiRequest, NextApiResponse } from 'next';

// mqttDevices
async function mqttDevices(
  { body }: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  try {
    if (body) {
      await writeDisabledDevices(body);
      res.send({ message: 'Success', status: 200 });
    }
  } catch (e) {
    try {
      const data = await readDisabledDevices();
      res.send(data);
    } catch (e) {
      await writeDisabledDevices([]);
    }
  }
}

export default mqttDevices;
