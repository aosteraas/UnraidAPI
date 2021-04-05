import React, { useState, useEffect } from 'react';
import { ServerMap, UnraidServer } from 'models/server';
import { Flex } from '@chakra-ui/react';
import { ApiRoute } from 'routes';
import { ServerCard } from './ServerCard';

export function Servers(): JSX.Element {
  const [servers, setServers] = useState<UnraidServer[]>();
  const getDetails = async () => {
    try {
      const resp = await fetch(ApiRoute.GetServers, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const res = await resp.json();
      const serverArray = Object.values(res.servers as ServerMap);
      setServers(serverArray);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const timer = setInterval(getDetails, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Flex ml="1rem" flexDir="column">
      {servers?.map((server, idx) => (
        <ServerCard key={server.ip ?? idx} server={server} />
      ))}
    </Flex>
  );
}
