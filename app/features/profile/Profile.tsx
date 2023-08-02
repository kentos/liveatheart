import { Alert, Switch, View } from 'react-native';
import { Body, Headline, Title } from '../../components/Texts';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import Colors from '../../constants/Colors';
import useProfile from './useProfile';
import { IncompleteProfile } from './IncompleteProfile';
import Avatar from './Avatar';
import { getState } from '../../libs/pushNotifications';
import { useOnboardingModal } from '../push/OnboardingModal';
import OneSignal from 'react-native-onesignal';
import Button from '../../components/Button';

function Profile() {
  const navigation = useNavigation();
  const { data, isIncompleteProfile } = useProfile();
  const showModal = useOnboardingModal((state) => state.show);
  const [push, setPush] = useState(false);

  useEffect(() => {
    (async function run() {
      const state = await getState();
      console.log('Disabled:', state.isPushDisabled);
      setPush(!state.isPushDisabled);
    })();
  }, []);

  const togglePush = async () => {
    const state = await getState();
    if (!state.hasNotificationPermission) {
      showModal();
      return;
    }
    if (state.isPushDisabled) {
      OneSignal.disablePush(false);
      setPush(true);
    } else {
      OneSignal.disablePush(true);
      setPush(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({ title: 'Your profile' });
  }, []);

  if (isIncompleteProfile) {
    return <IncompleteProfile />;
  }
  return (
    <View style={{ flex: 1, backgroundColor: Colors.light.background, padding: 16 }}>
      <View style={{ alignItems: 'center' }}>
        <Avatar size={96} firstName={data?.firstName} lastName={data?.lastName} />
        <View style={{ height: 16 }} />
        <Headline>
          {data?.firstName} {data?.lastName}
        </Headline>
        <Body>{data?.email}</Body>
      </View>

      <View style={{ marginTop: 32 }}>
        <Title>Push notifications</Title>
        <View style={{ height: 1, backgroundColor: Colors.light.border, marginVertical: 8 }} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <Body>Recieve push notifications</Body>
          <Switch
            value={push}
            onValueChange={togglePush}
            trackColor={{ false: Colors.light.border, true: Colors.light.tint }}
          />
        </View>

        {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            opacity: 0.25,
            marginBottom: 8,
          }}
        >
          <Body>Concert reminder (15 min before)</Body>
          <Switch
            value={push}
            onValueChange={setPush}
            trackColor={{ false: Colors.light.border, true: Colors.light.tint }}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            opacity: 0.25,
            marginBottom: 8,
          }}
        >
          <Body>News</Body>
          <Switch
            value={push}
            onValueChange={setPush}
            trackColor={{ false: Colors.light.border, true: Colors.light.tint }}
          />
        </View> */}
      </View>

      <View style={{ marginTop: 32 }}>
        <Title>Account</Title>
        <View style={{ height: 1, backgroundColor: Colors.light.border, marginVertical: 8 }} />
        <Button
          onPress={() =>
            Alert.alert(
              'Remove your account?',
              'This will remove all your favorites and reset the app.',
              [
                { text: 'Cancel' },
                {
                  text: 'Remove',
                  onPress: () => {
                    navigation.navigate('RemoveAccount');
                  },
                  style: 'destructive',
                },
              ]
            )
          }
        >
          Remove account
        </Button>
      </View>
    </View>
  );
}

export default Profile;
