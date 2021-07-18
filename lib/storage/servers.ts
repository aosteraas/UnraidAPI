import fs from 'fs';
import path from 'path';
import { CONFIG_DIR, SERVERS_JSON, SERVERS_JSON_NEW } from '@lib/config';
import { ServerMap } from '@models/server';
import { UnraidDetails } from '@lib/unraid';

/**
 * Reads in the contents of config/servers.json. Returns empty object when
 * something has gone horribly wrong.
 */
export async function parseServers(): Promise<ServerMap> {
  await checkCreateConfigDirectory();
  await checkCreateServersJson();
  const servers = await readServersJson();
  return servers;
}

/**
 * Check for the config directory and create it if not found.
 */
async function checkCreateConfigDirectory() {
  const location = path.join(CONFIG_DIR);

  try {
    const exists = fs.existsSync(CONFIG_DIR);

    if (!exists) {
      await fs.promises.mkdir(location);
    }
  } catch {
    console.error('Unable to create config directory');
  }
}

/**
 * Check for the existence of servers.json and create if not found.
 */
async function checkCreateServersJson() {
  const location = path.join(CONFIG_DIR, SERVERS_JSON);

  try {
    const exists = fs.existsSync(location);

    if (!exists) {
      await fs.promises.writeFile(location, JSON.stringify({}));
    }
  } catch (err) {
    console.log(err);
    console.error(`${location} does not exist or was not able to be created`);
  }
}

/**
 * Read in servers.json and parse into ServerMap object.
 */
async function readServersJson() {
  const location = path.join(CONFIG_DIR, SERVERS_JSON);
  try {
    const data = await fs.promises.readFile(location);
    const servers = JSON.parse(data.toString());
    return servers as ServerMap;
  } catch (err) {
    console.log(err);
    console.error(`Unable to read and/orparse ${CONFIG_DIR}/${SERVERS_JSON}`);
    return {};
  }
}

/**
 * Write contents of a server map into servers.json. This is a one way operation
 * @param servers payload of servers to write
 */
export async function writeServersJson(servers: ServerMap): Promise<void> {
  const location = path.join(CONFIG_DIR, SERVERS_JSON);
  try {
    const data = JSON.stringify(servers);

    await fs.promises.writeFile(location, data);
  } catch (err) {
    console.error(`Failed to write servers.json keys to ${location}.`);
    console.error(err);
  }
}

export async function writeServersNewJson(
  servers: UnraidDetails[],
): Promise<void> {
  const location = path.join(CONFIG_DIR, SERVERS_JSON_NEW);
  try {
    const data = JSON.stringify(servers);

    await fs.promises.writeFile(location, data);
  } catch (err) {
    console.error(`Failed to write servers-new.json keys to ${location}.`);
    console.error(err);
  }
}

export async function readServersNewJson(): Promise<UnraidDetails[]> {
  const location = path.join(CONFIG_DIR, SERVERS_JSON_NEW);
  try {
    await checkCreateServersNewJson();
    const data = await fs.promises.readFile(location);
    const servers = JSON.parse(data.toString());
    return servers as UnraidDetails[];
  } catch (err) {
    console.log(err);
    console.error(`Unable to read and/orparse ${CONFIG_DIR}/${SERVERS_JSON}`);
    return [];
  }
}

/**
 * Check for the existence of servers.json and create if not found.
 */
async function checkCreateServersNewJson() {
  const location = path.join(CONFIG_DIR, SERVERS_JSON_NEW);

  try {
    const exists = fs.existsSync(location);

    if (!exists) {
      await fs.promises.writeFile(location, JSON.stringify([]));
    }
  } catch (err) {
    console.log(err);
    console.error(`${location} does not exist or was not able to be created`);
  }
}
