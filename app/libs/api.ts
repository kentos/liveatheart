import axios from 'axios';
import config from '../constants/config';
import { requestInterceptor, responseErrorInterceptor } from './apiInterceptors';

const instance = axios.create({
  baseURL: config.api,
  timeout: 15000,
});

instance.interceptors.request.use(requestInterceptor);
instance.interceptors.response.use(undefined, responseErrorInterceptor(instance));

async function get<T>(url: string) {
  return instance.get<T>(url);
}

async function post<T>(url: string, data: any) {
  return instance.post<T>(url, data);
}

async function put<T>(url: string, data: any) {
  return instance.put<T>(url, data);
}

async function del(url: string) {
  return instance.delete(url);
}

export { get, post, put, del };
