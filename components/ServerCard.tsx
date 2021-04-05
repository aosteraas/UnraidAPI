import { UnraidServer } from 'models/server';
import {
  Flex,
  Heading,
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  AccordionIcon,
  Text,
} from '@chakra-ui/react';
import { ServerDetails } from './ServerDetails';

interface Props {
  server: UnraidServer;
}

export function ServerCard({ server }: Props): JSX.Element {
  return (
    <Flex
      borderRadius="md"
      p="1rem"
      backgroundColor="gray.700"
      minWidth={{ base: '100%', md: '34rem' }}
      maxWidth={{ base: '100%', md: '34rem' }}
      flexDir="column"
    >
      <Heading size="md">{server.serverDetails?.title ?? ''}</Heading>
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton px="unset">
            <Text>Details</Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel px="unset">
            <ServerDetails ip={server.ip} details={server.serverDetails} />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  );
}

// const startVM = (vm) => {};
// const pauseVM = (vm) => {};
// const restartVM = (vm) => {};
// const stopVM = (vm) => {};
// const forceStopVM = (vm) => {};
// const downloadXML = (vm) => {};
// const startDocker = (docker) => {};
// const pauseDocker = (docker) => {};
// const restartDocker = (docker) => {};
// const stopDocker = (docker) => {};
// const download = (filename, text) => {};
