import { Flex, Image, Button, ButtonGroup, IconButton } from '@chakra-ui/react';
import {
  IoPauseCircleOutline,
  IoStopCircleOutline,
  // IoPlayCircleOutline,
  IoReloadOutline,
  IoHelpOutline,
} from 'react-icons/io5';
import { VmChange } from 'hooks/useVmManager';
import { Vm } from 'store/vmStore';

interface Props {
  ip?: string;
  vm: Vm;
  start: VmChange;
  restart: VmChange;
  pause: VmChange;
  stop: VmChange;
  forceStop: VmChange;
}

export function VirtualMachine({
  ip,
  vm,
  start,
  stop,
  restart,
  forceStop,
  pause,
}: Props): JSX.Element {
  return (
    <Flex flexDir="column">
      <Flex>
        <ButtonGroup size="md" isAttached width="100%">
          <Button background="gray.800" py="5px">
            <Image
              boxSize="1.875rem"
              src={`//${ip}${vm.icon}`}
              fallback={<IoHelpOutline />}
            />
          </Button>
          <Button mr="-px" width="60%" justifyContent="flex-start" flex={1}>
            {vm.name}
          </Button>
          <IconButton
            isDisabled={vm.isBusy}
            fontSize="1.25rem"
            aria-label="Pause container"
            colorScheme="teal"
            icon={<IoPauseCircleOutline />}
            onClick={() => pause(vm.id)}
          >
            Pause
          </IconButton>
          <IconButton
            isDisabled={vm.isBusy}
            fontSize="1.25rem"
            aria-label="Restart container"
            colorScheme="yellow"
            icon={<IoReloadOutline />}
            onClick={() => restart(vm.id)}
          >
            Restart
          </IconButton>
          <IconButton
            isDisabled={vm.isBusy}
            fontSize="1.25rem"
            aria-label="Stop container"
            colorScheme="red"
            icon={<IoStopCircleOutline />}
            onClick={() => stop(vm.id)}
          >
            Stop
          </IconButton>
        </ButtonGroup>
      </Flex>
    </Flex>
  );
}
