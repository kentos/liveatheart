import * as Device from 'expo-device';
import { post } from '../../libs/api';

async function ping() {
  post('/me/ping', { timestamp: new Date(), os: Device.osName, osVersion: Device.osVersion });
}

export default ping;
