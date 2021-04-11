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
  const { data, start, stop, restart, forceStop, pause, resume } = useVmManager(
    ip,
    vms,
  );

  if (!vms) {
    return null;
  }

  return (
    <Flex flexDir="column">
      {data.map((vm, idx) => {
        return (
          <VirtualMachine
            key={vm.id ?? idx}
            start={start}
            restart={restart}
            pause={pause}
            stop={stop}
            forceStop={forceStop}
            resume={resume}
            vm={vm}
            ip={ip}
          />
        );
      })}
    </Flex>
  );
}
