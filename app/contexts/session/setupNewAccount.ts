import { post } from '../../libs/api';

async function setupNewAccount() {
  const newid = await post<{ refreshToken: string }>('/auth', { newAccount: true });
  return newid.data.refreshToken;
}

export default setupNewAccount;
