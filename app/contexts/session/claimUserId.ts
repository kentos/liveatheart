import { post } from '../../libs/api';

async function claimUserId(userid: string) {
  await post('/users', { _id: userid });
}

export default claimUserId;
