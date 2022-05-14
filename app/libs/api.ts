import axios from 'axios';
import { QueryKey } from 'react-query';

const instance = axios.create({
  baseURL: __DEV__ ? 'http://10.0.1.49:8080' : 'https://lah22-app-zy78m.ondigitalocean.app',
});

async function get<T>(url: string | QueryKey) {
  return instance.get<T>(String(url));
}

export { get };
