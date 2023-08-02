import { View } from 'react-native';
import { Title } from '../../components/Texts';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { resetClient, setupClient } from '../../contexts/session/restoreUserSession';
import { trpc } from '../../libs/trpc';

export default function RemoveAccount() {
  const navigation = useNavigation();
  const removeAccount = trpc.user.deleteProfile.useMutation();

  const utils = trpc.useContext();

  const resetNavigation = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Root' }],
    });
  };

  const resetAccount = async () => {
    await removeAccount.mutateAsync();
    await resetClient();
    await setupClient();
  };

  useEffect(() => {
    (async function () {
      await resetAccount();
      await utils.me.invalidate();
      await utils.artists.getAllArtists.invalidate();
      await utils.news.getNews.invalidate();
      await utils.auth.invalidate();
      resetNavigation();
    })();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Title>Removing account...</Title>
    </View>
  );
}
