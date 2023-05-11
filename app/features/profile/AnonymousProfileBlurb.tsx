import { View } from 'react-native';
import { Body } from '../../components/Texts';
import Colors from '../../constants/Colors';

export function AnonymousProfileBlurb() {
  return (
    <View
      style={{
        backgroundColor: Colors.light.tint,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
      }}
    >
      <Body color={Colors.light.background}>
        You currently are using an anonymous profile. Complete the setup to start using all features
        in the app. And store your hearts safely.
      </Body>
    </View>
  );
}
