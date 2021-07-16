import { UnraidServer } from '@models/server';
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
import { Dockers } from './Dockers';
import { VirtualMachines } from './VirtualMachines';

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
        <AccordionItem>
          <AccordionButton px="unset">
            <Text>VMs</Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel px="unset">
            <VirtualMachines ip={server.ip} vms={server.vm?.details} />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton px="unset">
            <Text>Docker</Text>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel px="unset">
            <Dockers
              ip={server.ip}
              containers={server.docker?.details?.containers}
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  );
}
