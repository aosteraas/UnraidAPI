import { DockerContainer } from 'models/docker';
import { useState, useEffect } from 'react';
import { ApiRoute } from 'routes';
import { useDockerStore, Container } from 'store/dockerStore';

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
  data: Container[];
}

/**
 * Encapsulate docker container management. Maintains array of containerIds to
 * determine which are busy. Exposes start/stop/pause/restart functions and busy
 * boolean.
 *
 * @todo make this take in the container data and format it as it looks like we
 * will need to make some changes to the data stored in state between periodic
 * polling of the server
 *
 * @param ip the server's IP
 */
export function useDockerManager(
  ip?: string,
  containers?: Record<string, DockerContainer>,
): DockerManager {
  const [data, setContainers, setBusy] = useDockerStore((s) => [
    s.containers,
    s.setContainers,
    s.setBusy,
  ]);

  useEffect(() => {
    const parsed = parseContainers(containers ?? {});
    setContainers(parsed);
  }, [containers, setContainers]);

  const start = async (id: string) => {
    if (!ip) return;
    try {
      setBusy(id, true);
      // todo something with response.
      const resp = await sendRequest(id, 'domain-start');
      setBusy(id, false);
    } catch (err) {
      //
      setBusy(id, false);
    }
  };

  const pause = async (id: string) => {
    if (!ip) return;
    try {
      setBusy(id, true);
      // todo something with response.
      const resp = await sendRequest(id, 'domain-pause');
      setBusy(id, false);
    } catch (err) {
      //
      setBusy(id, false);
    }
  };

  const restart = async (id: string) => {
    if (!ip) return;
    try {
      setBusy(id, true);
      // todo something with response.
      const resp = await sendRequest(id, 'domain-restart');
      setBusy(id, false);
    } catch (err) {
      //
      setBusy(id, false);
    }
  };

  const stop = async (id: string) => {
    if (!ip) return;
    try {
      setBusy(id, true);
      // todo something with response.
      const resp = await sendRequest(id, 'domain-stop');
      setBusy(id, false);
    } catch (err) {
      //
      setBusy(id, false);
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

  return { start, pause, stop, restart, data };
}

function parseContainers(containers: Record<string, DockerContainer>) {
  return Object.entries(containers).map(([, data]) => ({
    ...data,
    isBusy: false,
  }));
}
