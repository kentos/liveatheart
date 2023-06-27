import { StyleSheet, View } from 'react-native';
import { Body, Headline } from '../../components/Texts';
import Button from '../../components/Button';
import { create } from 'zustand';
import OneSignal from 'react-native-onesignal';

export const useOnboardingModal = create<{ visible: boolean; show: () => void; hide: () => void }>(
  (set) => ({
    visible: false,
    show: () => set({ visible: true }),
    hide: () => set({ visible: false }),
  })
);

export default function OnboardingModal() {
  const visible = useOnboardingModal((state) => state.visible);
  const hide = useOnboardingModal((state) => state.hide);
  if (!visible) return null;
  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,.4)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          paddingHorizontal: 32,
          paddingVertical: 24,
          marginHorizontal: 32,
          backgroundColor: '#fff',
          borderRadius: 16,
        }}
      >
        <Headline>Push notifications?</Headline>
        <View style={{ height: 8 }} />
        <Body>
          Activating push notifications enables you to be reminded about news and when your favorite
          artists are about to perform.
        </Body>
        <View style={{ height: 16 }} />
        <Button
          inverted
          onPress={() => {
            OneSignal.promptForPushNotificationsWithUserResponse((response) => {
              if (response) {
                OneSignal.disablePush(false);
              }
              hide();
            });
          }}
        >
          Activate now
        </Button>
        <View style={{ height: 4 }} />
        <Button onPress={hide}>No thanks</Button>
      </View>
    </View>
  );
}
