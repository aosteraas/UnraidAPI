import { Flex } from '@chakra-ui/react';
import { useVmManager } from 'hooks';
import { VmDetailsMap } from 'models/vm';
import React from 'react';
import { VirtualMachine } from './VirtualMachine';

interface Props {
  ip?: string;
  vms?: VmDetailsMap;
}

export function VirtualMachines({ vms, ip }: Props): JSX.Element | null {
  const { data } = useVmManager(ip, vms);

  if (!vms) {
    return null;
  }

  return (
    <Flex flexDir="column">
      {data.map((vm, idx) => {
        return <VirtualMachine key={vm.id ?? idx} vm={vm} ip={ip} />;
      })}
    </Flex>
  );
}
