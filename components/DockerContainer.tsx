import { DockerContainer as Container } from 'models/docker';
import { Image, Button, ButtonGroup, IconButton } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import React from 'react';
import {
  IoPauseCircleOutline,
  IoStopCircleOutline,
  IoPlayCircleOutline,
  IoReloadOutline,
  IoHelpOutline,
} from 'react-icons/io5';

export interface DockerContainerProps {
  id: string;
  container: Container;
  isBusy: boolean;
  ip?: string;
  start: (id: string) => Promise<void>;
  pause: (id: string) => Promise<void>;
  stop: (id: string) => Promise<void>;
  restart: (id: string) => Promise<void>;
}

export function DockerContainer({
  id,
  container,
  isBusy,
  ip,
  pause,
  restart,
  stop,
}: DockerContainerProps): JSX.Element {
  return (
    <Flex flexDir="column">
      <Flex>
        <ButtonGroup size="md" isAttached width="100%">
          <Button background="gray.800" py="5px">
            <Image
              boxSize="1.875rem"
              src={`//${ip}${container.imageUrl}`}
              fallback={<IoHelpOutline />}
            />
          </Button>
          <Button mr="-px" width="60%" justifyContent="flex-start">
            {container.name}
          </Button>
          <IconButton
            isDisabled={isBusy}
            fontSize="1.25rem"
            aria-label="Pause container"
            colorScheme="teal"
            icon={<IoPauseCircleOutline />}
            onClick={() => pause(id)}
          >
            Pause
          </IconButton>
          <IconButton
            isDisabled={isBusy}
            fontSize="1.25rem"
            aria-label="Restart container"
            colorScheme="yellow"
            icon={<IoReloadOutline />}
            onClick={() => restart(id)}
          >
            Restart
          </IconButton>
          <IconButton
            isDisabled={isBusy}
            fontSize="1.25rem"
            aria-label="Stop container"
            colorScheme="red"
            icon={<IoStopCircleOutline />}
            stop={() => stop(id)}
          >
            Stop
          </IconButton>
        </ButtonGroup>
      </Flex>
    </Flex>
  );
}
