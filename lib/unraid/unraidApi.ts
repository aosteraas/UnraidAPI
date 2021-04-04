import axios from 'axios';
import https from 'https';

const unraidApi = axios.create();

unraidApi.defaults.withCredentials = true;

unraidApi.defaults.httpsAgent = new https.Agent({
  keepAlive: true,
  rejectUnauthorized: false,
});

export { unraidApi };
