import { AxiosError, AxiosHeaders, AxiosInstance, AxiosRequestConfig } from 'axios';
import { getRefreshToken } from '../contexts/session/getRefreshToken';
import { renewAuthToken } from './tokens';
import useUserState from '../contexts/session/useUserState';

export function requestInterceptor(config: AxiosRequestConfig) {
  if (config.headers && useUserState.getState().authToken) {
    (config.headers as AxiosHeaders).set(
      'Authorization',
      `Bearer ${useUserState.getState().authToken}`
    );
  }
  return config;
}

export function responseErrorInterceptor(instance: AxiosInstance) {
  return async function (error: AxiosError) {
    if (error.response?.status === 401) {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        await renewAuthToken(refreshToken);
        if (error.config) {
          return instance.request(error.config);
        }
      }
    }
    return Promise.reject(error);
  };
}
