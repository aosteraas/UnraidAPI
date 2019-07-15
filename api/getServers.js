import fs from "fs";
import { getUnraidDetails } from "../utils/Unraid";

export default function(req, res, next) {
  let servers = {};
  try {
    servers = JSON.parse(fs.readFileSync("config/servers.json"));
  } catch (e) {
    console.log("Failed to retrieve config file, creating new. Error message: ", e);
    fs.writeFileSync("config/servers.json", servers);
  }
  if (!req.headers.authorization || Object.keys(req.headers.authorization).length < Object.keys(servers).length) {
    let response = {};
    Object.keys(servers).forEach(ip => {
      response[ip] = true;
    });
    res.send({ servers: response });
    return;
  }
  let response = {};
  response.servers = servers;
  getUnraidDetails(response.servers, JSON.parse(req.headers.authorization));
  response.status = 200;
  res.send(response);
};