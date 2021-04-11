import { Flex, Image, Button, ButtonGroup, IconButton } from '@chakra-ui/react';
import React from 'react';
import {
  IoPauseCircleOutline,
  IoStopCircleOutline,
  IoPlayCircleOutline,
  IoReloadOutline,
  IoHelpOutline,
} from 'react-icons/io5';
import { Container } from 'store/dockerStore';

export interface DockerContainerProps {
  id: string;
  container: Container;
  ip?: string;
  start: (id: string) => Promise<void>;
  pause: (id: string) => Promise<void>;
  stop: (id: string) => Promise<void>;
  restart: (id: string) => Promise<void>;
  resume: (id: string) => Promise<void>;
}

export function DockerContainer({
  id,
  container,
  ip,
  pause,
  restart,
  start,
  stop,
  resume,
}: DockerContainerProps): JSX.Element {
  const isPaused = container.status === 'paused';
  const resumePause = isPaused ? resume : pause;
  const ResumePauseIcon = isPaused ? IoPlayCircleOutline : IoPauseCircleOutline;
  const resumePauseText = isPaused ? 'Resume' : 'Pause';

  const isStopped = container.status === 'stopped';
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
              src={`${container.imageUrl}`}
              fallback={<IoHelpOutline />}
            />
          </Button>
          <Button mr="-px" width="60%" justifyContent="flex-start" flex={1}>
            {container.name}
          </Button>
          <IconButton
            isDisabled={container.isBusy}
            fontSize="1.25rem"
            aria-label={`${resumePauseText} container`}
            colorScheme="teal"
            icon={<ResumePauseIcon />}
            onClick={() => resumePause(id)}
            disabled={isStopped}
          >
            {resumePauseText}
          </IconButton>
          <IconButton
            isDisabled={container.isBusy}
            fontSize="1.25rem"
            aria-label="Restart container"
            colorScheme="yellow"
            icon={<IoReloadOutline />}
            onClick={() => restart(id)}
            disabled={isStopped}
          >
            Restart
          </IconButton>
          <IconButton
            isDisabled={container.isBusy}
            fontSize="1.25rem"
            aria-label={`${stopStartText} container`}
            colorScheme="red"
            icon={<StopStartIcon />}
            onClick={() => stopStart(id)}
          >
            {stopStartText}
          </IconButton>
        </ButtonGroup>
      </Flex>
    </Flex>
  );
}
