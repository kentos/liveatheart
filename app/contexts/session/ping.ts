import * as Device from 'expo-device';
import { trcpVanilla } from '../../libs/trpc';

async function ping() {
  trcpVanilla.user.ping.mutate({
    timestamp: new Date(),
    os: Device.osName,
    osVersion: Device.osVersion,
  });
}

export default ping;
