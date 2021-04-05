import Head from 'next/head';
import { Flex } from '@chakra-ui/react';
import { Servers, ServerSetup } from 'components';

function Home(): JSX.Element {
  return (
    <Flex p="1rem">
      <Head>
        <title>Unraid API</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ServerSetup />
      <Servers />
    </Flex>
  );
}

export default Home;
