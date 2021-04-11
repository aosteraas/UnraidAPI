import {
  Flex,
  Image,
  Button,
  ButtonGroup,
  IconButton,
  Badge,
} from '@chakra-ui/react';
import {
  IoPauseCircleOutline,
  IoStopCircleOutline,
  // IoPlayCircleOutline,
  IoReloadOutline,
  IoHelpOutline,
} from 'react-icons/io5';
import { BiBomb } from 'react-icons/bi';
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
          <IconButton
            isDisabled={vm.isBusy}
            fontSize="1.25rem"
            aria-label="Force stop container"
            colorScheme="red"
            background="red.500"
            icon={<BiBomb />}
            onClick={() => forceStop(vm.id)}
          >
            Force Stop
          </IconButton>
        </ButtonGroup>
      </Flex>
      <Flex justifyContent="space-between">
        <BadgePair label="Cores" value={vm.coreCount} />
        <BadgePair label="RAM" value={vm.ramAllocation} />
        <BadgePair label="HDD" value={vm.hddAllocation.total} />
        <BadgePair label="GPU" value={vm.primaryGPU} />
        <BadgePair label="Status" value={vm.status} />
      </Flex>
    </Flex>
  );
}

interface BadgePairProps {
  label: string;
  value?: string | number;
}
function BadgePair({ label, value }: BadgePairProps) {
  return (
    <Flex>
      <Badge colorScheme="black">{label}</Badge>
      <Badge colorScheme="teal">{value}</Badge>
    </Flex>
  );
}
