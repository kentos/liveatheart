import { AxiosRequestConfig } from 'axios';
import useUserState from '../contexts/session/useUserState';

const requestInterceptor = (request: AxiosRequestConfig) => {
  request.headers = {
    ...request.headers,
    ...(useUserState.getState()._id && { Authorization: `User ${useUserState.getState()._id}` }),
  };
  return request;
};

export { requestInterceptor };
