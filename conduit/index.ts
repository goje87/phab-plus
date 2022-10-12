import path from 'path';
import fs from 'fs';
import axios from 'axios';

let token: string;
let host: string;
export function init() {
  const configFile = path.join(process.env.HOME, '.arcrc');
  const data = fs.readFileSync(configFile, { encoding: 'utf-8' });
  const config = JSON.parse(data);

  host = Object.keys(config.hosts)[0];
  const hostData = config.hosts[host];
  token = hostData.token;
}

export async function exec(route: string, params: Record<string, any>) {
  params.__conduit__ = { token };

  const response = await axios.post(
    `${host}${route}`,
    {
      output: 'json',
      params: JSON.stringify(params),
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
}
init();
