import { View, StyleSheet } from 'react-native';
import { Body } from '../../components/Texts';
import Colors from '../../constants/Colors';

export function AnonymousProfileBlurb() {
  return (
    <View
      style={{
        backgroundColor: Colors.light.background,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.light.tint,
      }}
    >
      <Body color={Colors.light.tint}>
        You are currently using an anonymous profile. Complete the setup to start using all features
        in the app. And store your hearts safely.
      </Body>
    </View>
  );
}
