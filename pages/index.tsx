import Head from 'next/head';
import { Flex } from '@chakra-ui/react';
import { ServerDetails, ServerSetup } from 'components';

function Home(): JSX.Element {
  return (
    <Flex p="1rem">
      <Head>
        <title>Unraid API</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ServerSetup />
      <ServerDetails />
    </Flex>
  );
}

export default Home;
