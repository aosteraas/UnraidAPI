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
  IoPlayCircleOutline,
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
  resume: VmChange;
}

export function VirtualMachine({
  ip,
  vm,
  start,
  resume,
  stop,
  restart,
  forceStop,
  pause,
}: Props): JSX.Element {
  const isPaused = vm.status === 'paused' || vm.status === 'pmsuspended';
  const resumePause = isPaused ? resume : pause;
  const ResumePauseIcon = isPaused ? IoPlayCircleOutline : IoPauseCircleOutline;
  const resumePauseText = isPaused ? 'Resume' : 'Pause';

  const isStopped = vm.status === 'stopped';
  const stopStart = isStopped ? start : stop;
  const StopStartIcon = isStopped ? IoPlayCircleOutline : IoStopCircleOutline;
  const stopStartText = isStopped ? 'Start' : 'Stop';
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
            aria-label={`${resumePauseText} VM`}
            colorScheme="teal"
            icon={<ResumePauseIcon />}
            onClick={() => resumePause(vm.id)}
          >
            {resumePauseText}
          </IconButton>
          <IconButton
            isDisabled={vm.isBusy}
            fontSize="1.25rem"
            aria-label="Restart VM"
            colorScheme="yellow"
            icon={<IoReloadOutline />}
            onClick={() => restart(vm.id)}
            disabled={isStopped}
          >
            Restart
          </IconButton>
          <IconButton
            isDisabled={vm.isBusy}
            fontSize="1.25rem"
            aria-label={`${stopStartText} VM`}
            colorScheme="red"
            icon={<StopStartIcon />}
            onClick={() => stopStart(vm.id)}
          >
            {stopStartText}
          </IconButton>
          <IconButton
            isDisabled={vm.isBusy}
            fontSize="1.25rem"
            aria-label="Force stop VM"
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
