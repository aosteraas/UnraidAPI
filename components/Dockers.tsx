import { DockerContainer as Container } from 'models/docker';
import { Flex } from '@chakra-ui/react';
import { DockerContainer } from './DockerContainer';
import { useDockerManager } from 'hooks';

interface Props {
  ip?: string;
  containers?: Record<string, Container>;
}

export function Dockers({ containers, ip }: Props): JSX.Element | null {
  const { start, pause, stop, restart, resume, data } = useDockerManager(
    ip,
    containers,
  );

  if (!containers) {
    return null;
  }

  return (
    <Flex flexDir="column">
      {data.map((cont) => {
        return (
          <DockerContainer
            key={cont.containerId}
            id={cont.containerId}
            container={cont}
            ip={ip}
            start={start}
            pause={pause}
            stop={stop}
            restart={restart}
            resume={resume}
          />
        );
      })}
    </Flex>
  );
}
