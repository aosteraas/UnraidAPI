import { Button, Flex } from '@chakra-ui/react';
import React from 'react';

export function ServerDetails(): JSX.Element {
  const getDetails = async () => {
    try {
      const resp = await fetch('/api/servers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const body = await resp.json();
      console.log(body);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Flex>
      <Button onClick={getDetails}>Go</Button>
    </Flex>
  );
}
