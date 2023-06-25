import { Switch, View } from 'react-native';
import { Body, Headline, Title } from '../../components/Texts';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect, useState } from 'react';
import Colors from '../../constants/Colors';
import useProfile from './useProfile';
import { IncompleteProfile } from './IncompleteProfile';
import Avatar from './Avatar';

function Profile() {
  const navigation = useNavigation();
  const { data, isIncompleteProfile } = useProfile();

  const [push, setPush] = useState(false);

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

      {/* <View style={{ height: 16 }} />

      <View>
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
        </View>
      </View> */}
    </View>
  );
}

export default Profile;
