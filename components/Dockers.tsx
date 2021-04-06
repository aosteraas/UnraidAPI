import { DockerContainer as Container } from 'models/docker';
import { Flex } from '@chakra-ui/react';
import { DockerContainer } from './DockerContainer';
import { useDockerManager } from 'hooks';

interface Props {
  ip?: string;
  containers?: Record<string, Container>;
}

function parseContainers(containers: Record<string, Container>) {
  return Object.entries(containers).map(([key, value]) => ({ key, value }));
}

export function Dockers({ containers, ip }: Props): JSX.Element | null {
  const { start, pause, stop, restart, busy } = useDockerManager(ip);

  if (!containers) {
    return null;
  }

  const data = parseContainers(containers);

  return (
    <Flex flexDir="column">
      {data.map(({ key, value }) => {
        const isBusy = busy.includes(key);
        return (
          <DockerContainer
            key={key}
            id={key}
            container={value}
            isBusy={isBusy}
            ip={ip}
            start={start}
            pause={pause}
            stop={stop}
            restart={restart}
          />
        );
      })}
    </Flex>
  );
}
