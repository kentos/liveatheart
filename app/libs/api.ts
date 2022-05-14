import axios from 'axios';
import { QueryKey } from 'react-query';

const instance = axios.create({
  baseURL: 'http://10.0.1.49:8080',
});

async function get<T>(url: string | QueryKey) {
  return instance.get<T>(String(url));
}

export { get };
