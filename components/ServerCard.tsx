import { Flex } from '@chakra-ui/react';

interface Props {
  server: string;
  ip: string;
  // checkForServerPassword
}

export function ServerCard({ ip, server }: Props): JSX.Element {
  const startArray = () => {};
  const stopArray = () => {};
  const startVM = (vm) => {};
  const pauseVM = (vm) => {};
  const restartVM = (vm) => {};
  const stopVM = (vm) => {};
  const forceStopVM = (vm) => {};
  const downloadXML = (vm) => {};
  const startDocker = (docker) => {};
  const pauseDocker = (docker) => {};
  const restartDocker = (docker) => {};
  const stopDocker = (docker) => {};
  const download = (filename, text) => {};
  return (
    <Flex>
      <p>todo</p>
    </Flex>
  );
}
