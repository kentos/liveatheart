import { trcpVanilla } from '../../libs/trpc';

async function setupNewAccount() {
  const result = await trcpVanilla.auth.newAccount.mutate();
  return result.refreshToken;
}

export default setupNewAccount;
