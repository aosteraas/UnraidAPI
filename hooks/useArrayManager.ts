import { useState } from 'react';
import { ApiRoute } from 'routes';

interface ArrayManager {
  change: () => Promise<void>;
  busy: boolean;
  text: string;
  colorScheme: string;
}

/**
 * Encapsulate array management, tracks busy status, provides color scheme and
 * button copy to use in UI.
 * @param ip server's IP address
 * @param arrayStatus current array status as string
 */
export function useArrayManager(
  ip?: string,
  arrayStatus?: string,
): ArrayManager {
  const [busy, setBusy] = useState(false);

  const stopArray = async () => {
    if (busy || !ip) {
      return;
    }
    try {
      setBusy(true);
      await sendRequest('stop');
      setBusy(false);
    } catch (err) {
      setBusy(false);
    }
  };

  const startArray = async () => {
    if (busy || !ip) {
      return;
    }
    try {
      setBusy(true);
      await sendRequest('start');
      setBusy(false);
    } catch (err) {
      setBusy(false);
    }
  };

  const sendRequest = async (action: 'start' | 'stop') => {
    const res = await fetch(ApiRoute.ChangeArray, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip, action }),
    });

    if (res.status !== 200) {
      throw new Error("Something didn't work");
    }

    const data = await res.json();
    return data;
  };

  const arrayStarted = arrayStatus?.includes('Started');
  const text = arrayStarted ? 'Stop Array' : 'Start Array';
  const colorScheme = arrayStarted ? 'yellow' : 'green';
  const change = arrayStarted ? stopArray : startArray;

  return { change, busy, text, colorScheme };
}
