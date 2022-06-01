import axios from 'axios';
import { QueryKey } from 'react-query';
import { requestInterceptor } from './apiInterceptors';

const base = __DEV__ ? 'http://10.0.1.49:8080' : 'https://lah22.bastardcreative.se';

const instance = axios.create({
  baseURL: base,
});

instance.interceptors.request.use(requestInterceptor);

async function get<T>(url: string | QueryKey) {
  return instance.get<T>(String(url));
}

async function post<T>(url: string | QueryKey, data: any) {
  return instance.post<T>(String(url), data);
}

async function del(url: string | QueryKey) {
  return instance.delete(String(url));
}

export { get, post, del };
