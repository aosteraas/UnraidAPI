import { NextApiRequest, NextApiResponse } from 'next';
import { requestChange } from 'lib/api';
import { getCSRFToken } from 'lib/auth';
import { removePCICheck, addPCICheck } from 'lib/pci';
import { parseServers } from 'lib/storage';
import { changeVMState, gatherDetailsFromEditVM } from 'lib/vm';

async function pciAttach(
  { body }: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (body) {
    const response = {
      message: '',
      status: 0,
    };
    if (!body.option) {
      response.message = await attachPCI(body);
    } else if (body.option === 'detach') {
      response.message = await detachPCI(body);
    }
    response.status = 200;
    res.send(response);
  }
}

export default pciAttach;

interface PciAttachBody {
  server: string;
  id: string;
  auth: string;
  pciId: string;
  pciIds?: string[];
  option?: string;
}

async function attachPCI(data: PciAttachBody) {
  if (data.pciId && !data.pciIds) {
    data.pciIds = [data.pciId];
  }

  const vmObject = await gatherDetailsFromEditVM(
    data.server,
    data.id,
    undefined,
    data.auth,
  );
  const servers = await parseServers();
  const attached = [];

  data.pciIds.forEach((pciId) => {
    Object.keys(servers[data.server].vm.details).forEach((vmId) => {
      const vm = servers[data.server].vm.details[vmId];
      if (vm.edit && vm.edit.pcis && vm.status === 'started') {
        vm.edit.pcis.forEach((pciDevice) => {
          if (
            pciDevice.id.split('.')[0] === pciId.split('.')[0] &&
            vmId !== data.id &&
            pciDevice.checked
          ) {
            attached.push({ pciId: pciDevice.id, vmId, vm });
          }
        });
      }
    });
    addPCICheck(vmObject.edit, pciId);
  });

  const token = await getCSRFToken(data.server, data.auth);
  const stopped = {};
  if (attached) {
    for (let i = 0; i < attached.length; i++) {
      const vmWithPciDevice = attached[i];
      removePCICheck(vmWithPciDevice.vm.edit, vmWithPciDevice.pciId);
      if (!stopped[vmWithPciDevice.vmId]) {
        await changeVMState(
          vmWithPciDevice.vmId,
          'domain-stop',
          data.server,
          data.auth,
          token,
        );
      }
      await requestChange(
        data.server,
        vmWithPciDevice.vmId,
        // todo figure this out
        (servers[data.server] as any).authToken,
        vmWithPciDevice.vm.edit,
        false,
      );
      stopped[vmWithPciDevice.vmId] = true;
    }
  }

  await Promise.all(
    Object.keys(stopped).map((stoppedVMId) =>
      changeVMState(stoppedVMId, 'domain-start', data.server, data.auth, token),
    ),
  );

  await changeVMState(data.id, 'domain-stop', data.server, data.auth, token);
  const result = await requestChange(
    data.server,
    data.id,
    data.auth,
    vmObject.edit,
    false,
  );
  await changeVMState(data.id, 'domain-start', data.server, data.auth, token);
  return result;
}

async function detachPCI(data: PciAttachBody) {
  if (data.pciId && !data.pciIds) {
    data.pciIds = [data.pciId];
  }

  const vmObject = await gatherDetailsFromEditVM(
    data.server,
    data.id,
    undefined,
    data.auth,
  );

  data.pciIds.forEach((pciId) => {
    removePCICheck(vmObject.edit, pciId);
  });

  const token = await getCSRFToken(data.server, data.auth);
  await changeVMState(data.id, 'domain-stop', data.server, data.auth, token);
  const result = await requestChange(
    data.server,
    data.id,
    data.auth,
    vmObject.edit,
    false,
  );
  await changeVMState(data.id, 'domain-start', data.server, data.auth, token);
  return result;
}
