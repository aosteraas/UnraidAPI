import { VmDetailsMap } from 'models/vm';
import { useEffect } from 'react';
import { ApiRoute } from 'routes';
import { useVmStore, Vm } from 'store/vmStore';

export type VmChange = (id: string) => Promise<void>;

interface VmManager {
  data: Vm[];
  start: VmChange;
  restart: VmChange;
  pause: VmChange;
  stop: VmChange;
  forceStop: VmChange;
}

type VmAction =
  | 'domain-resume'
  | 'domain-start'
  | 'domain-restart'
  | 'domain-pause'
  | 'domain-stop'
  | 'domain-destroy';

export function useVmManager(ip?: string, vms?: VmDetailsMap): VmManager {
  const [data, setVms, setBusy, setStatus] = useVmStore((s) => [
    s.vms,
    s.setVms,
    s.setBusy,
    s.setStatus,
  ]);

  useEffect(() => {
    const parsed = parseVms(vms ?? {});
    setVms(parsed);
  }, [vms, setVms]);

  const handleResponse = async (res: Response, id: string) => {
    if (res.status !== 200) {
      setBusy(id, false);
      return;
    }

    const data = await res.json();
    if (data.message.state) {
      setStatus(id, data.message.state);
    } else if (
      data.message.error &&
      data.message.error ===
        'Requested operation is not valid: domain is not running'
    ) {
      setStatus(id, 'stopped');
    }
  };

  const start = async (id: string) => {
    try {
      setBusy(id, true);
      const res = await sendRequest(id, 'domain-start');
      await handleResponse(res, id);
    } catch {
      setBusy(id, true);
    }
  };

  const restart = async (id: string) => {
    try {
      setBusy(id, true);
      const res = await sendRequest(id, 'domain-restart');
      await handleResponse(res, id);
    } catch {
      setBusy(id, true);
    }
  };

  const pause = async (id: string) => {
    try {
      setBusy(id, true);
      const res = await sendRequest(id, 'domain-pause');
      await handleResponse(res, id);
    } catch {
      setBusy(id, true);
    }
  };

  const stop = async (id: string) => {
    try {
      setBusy(id, true);
      const res = await sendRequest(id, 'domain-stop');
      await handleResponse(res, id);
    } catch {
      setBusy(id, true);
    }
  };

  const forceStop = async (id: string) => {
    try {
      setBusy(id, true);
      const res = await sendRequest(id, 'domain-destroy');
      await handleResponse(res, id);
    } catch {
      setBusy(id, true);
    }
  };

  const sendRequest = async (id: string, action: VmAction) => {
    const res = await fetch(ApiRoute.UpdateVm, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip, id, action }),
    });

    return res;
  };

  return { data, start, stop, pause, forceStop, restart };
}

function parseVms(vms: VmDetailsMap) {
  return Object.entries(vms).map(([, data]) => ({ ...data, isBusy: false }));
}

// const downloadXML = (vm) => {};
// const download = (filename, text) => {};
