import { Wrap, Badge } from '@chakra-ui/layout';
import { Button, Flex } from '@chakra-ui/react';
import { isDefined } from 'lib/utils';
import { ServerDetails as Details } from 'models/server';
import React, { useState } from 'react';
import { ApiRoute } from 'routes';

interface Props {
  details?: Details;
  ip?: string;
}

function parseDetails(details: Details) {
  return Object.entries(details)
    .map(([key, value]) => ({ key, value }))
    .filter(isDefined)
    .map(({ key, value }) => {
      if (typeof value === 'boolean') {
        return { key, value: value.toString() };
      }
      if (key !== 'cpu') {
        return { key, value };
      }

      const newVal = value
        .toString()
        .replace('&#174', '®')
        .replace('&#8482', '™');
      return {
        key,
        value: newVal,
      };
    });
}

function useArrayManager(ip?: string, arrayStatus?: string) {
  const [busy, setBusy] = useState(false);

  const stopArray = async () => {
    if (busy || !ip) {
      return;
    }
    try {
      setBusy(true);
      await sendRequest('stop');
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

export function ServerDetails({ details, ip }: Props): JSX.Element | null {
  const { change, busy, text, colorScheme } = useArrayManager(
    ip,
    details.arrayStatus,
  );

  if (!details) {
    return null;
  }
  const data = parseDetails(details);

  console.log(data);
  return (
    <Flex flexDir="column">
      <Wrap py="0.5rem">
        {data.map(({ key, value }) => (
          <Badge key={key}>
            {key} - {value}
          </Badge>
        ))}
      </Wrap>
      <Button
        onClick={change}
        colorScheme={colorScheme}
        isDisabled={busy}
        isLoading={busy}
      >
        {text}
      </Button>
    </Flex>
  );
}
