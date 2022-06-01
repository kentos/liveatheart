import axios from 'axios';
import { QueryKey } from 'react-query';
import config from '../constants/config';
import { requestInterceptor } from './apiInterceptors';

const instance = axios.create({
  baseURL: config.api,
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
