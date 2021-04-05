import { getMqttConfig } from 'lib/config';
import { UnraidServer } from 'models/server';
import { MqttClient } from 'mqtt';
import { sanitise } from './sanitise';

const updated: Record<string, any> = {};

export function getDockerDetails(
  client: MqttClient,
  serverTitleSanitised: string,
  disabledDevices: string,
  dockerId: string,
  ip: string,
  server: UnraidServer,
): void {
  if (disabledDevices.includes(`${ip}|${dockerId}`)) {
    return;
  }
  if (
    !server ||
    !server.docker ||
    !server.docker.details ||
    !server.docker.details.containers
  ) {
    return;
  }
  const docker = server.docker.details.containers[dockerId];
  if (!docker) {
    return;
  }

  docker.name = sanitise(docker.name);

  if (!updated[ip]) {
    updated[ip] = {};
  }

  if (!updated[ip].dockers) {
    updated[ip].dockers = {};
  }
  const { MQTTBaseTopic } = getMqttConfig();
  if (updated[ip].dockers[dockerId] !== JSON.stringify(docker)) {
    client.publish(
      `${MQTTBaseTopic}/switch/${serverTitleSanitised}/${docker.name}/config`,
      JSON.stringify({
        payload_on: 'started',
        payload_off: 'stopped',
        value_template: '{{ value_json.status }}',
        state_topic: `${MQTTBaseTopic}/${serverTitleSanitised}/${docker.name}`,
        json_attributes_topic: `${MQTTBaseTopic}/${serverTitleSanitised}/${docker.name}`,
        name: `${serverTitleSanitised}_docker_${docker.name}`,
        unique_id: `${serverTitleSanitised}_${docker.name}`,
        device: {
          identifiers: [`${serverTitleSanitised}_${docker.name}`],
          name: `${serverTitleSanitised}_docker_${docker.name}`,
          manufacturer: server.serverDetails.motherboard,
          model: 'Docker',
        },
        command_topic: `${MQTTBaseTopic}/${serverTitleSanitised}/${docker.name}/dockerState`,
      }),
    );
    client.publish(
      `${MQTTBaseTopic}/${serverTitleSanitised}/${docker.name}`,
      JSON.stringify(docker),
    );
    client.subscribe(
      `${MQTTBaseTopic}/${serverTitleSanitised}/${docker.name}/dockerState`,
    );
    updated[ip].dockers[dockerId] = JSON.stringify(docker);
  }
}
