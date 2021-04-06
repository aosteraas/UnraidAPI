import { useState } from 'react';
import { ApiRoute } from 'routes';

type DockerAction =
  | 'domain-resume'
  | 'domain-start'
  | 'domain-restart'
  | 'domain-pause'
  | 'domain-stop';

interface DockerManager {
  start: (id: string) => Promise<void>;
  pause: (id: string) => Promise<void>;
  stop: (id: string) => Promise<void>;
  restart: (id: string) => Promise<void>;
  busy: string[];
}

export function useDockerManager(ip?: string): DockerManager {
  const [busy, setBusy] = useState<string[]>([]);

  const start = async (id: string) => {
    if (!ip) return;
    try {
      setBusy([...busy, id]);
      const resp = await sendRequest(id, 'domain-start');
      //
    } catch (err) {
      //
      setBusy(busy.filter((b) => b !== id));
    }
  };

  const pause = async (id: string) => {
    if (!ip) return;
    try {
      setBusy([...busy, id]);
      const resp = await sendRequest(id, 'domain-pause');
      //
    } catch (err) {
      //
      setBusy(busy.filter((b) => b !== id));
    }
  };

  const restart = async (id: string) => {
    if (!ip) return;
    try {
      setBusy([...busy, id]);
      const resp = await sendRequest(id, 'domain-restart');
      //
    } catch (err) {
      //
      setBusy(busy.filter((b) => b !== id));
    }
  };

  const stop = async (id: string) => {
    if (!ip) return;
    try {
      setBusy([...busy, id]);
      const resp = await sendRequest(id, 'domain-stop');
      //
    } catch (err) {
      //
      setBusy(busy.filter((b) => b !== id));
    }
  };

  const sendRequest = async (id: string, action: DockerAction) => {
    const res = await fetch(ApiRoute.UpdateDocker, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip, id, action }),
    });

    if (res.status !== 200) {
      throw new Error('Failed to modify container state');
    }

    const data = await res.json();
    return data;
  };

  return { start, pause, stop, restart, busy };
}
