import axios from 'axios';
import { QueryKey } from 'react-query';

const base = __DEV__ ? 'http://10.0.1.49:8080' : 'https://lah22.bastardcreative.se';

const instance = axios.create({
  baseURL: base,
});

async function get<T>(url: string | QueryKey) {
  return instance.get<T>(String(url));
}

async function post<T>(url: string | QueryKey, data: any) {
  return instance.post<T>(String(url), data);
}

export { get, post };
