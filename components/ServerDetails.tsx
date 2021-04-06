import { Wrap, Badge } from '@chakra-ui/layout';
import { Button, Flex } from '@chakra-ui/react';
import { useArrayManager } from 'hooks/useArrayManager';
import { isDefined } from 'lib/utils';
import { ServerDetails as Details } from 'models/server';

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
        .replace('&#8482', '™')
        .replaceAll(';', '');
      return {
        key,
        value: newVal,
      };
    });
}

export function ServerDetails({ details, ip }: Props): JSX.Element | null {
  const { change, busy, text, colorScheme } = useArrayManager(
    ip,
    details?.arrayStatus,
  );

  if (!details) {
    return null;
  }
  const data = parseDetails(details);

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
