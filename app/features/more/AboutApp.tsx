import { View, StyleSheet, Linking } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Body, BodySmall, Caption, Headline } from '../../components/Texts';
import useUserState from '../../contexts/session/useUserState';
import { useCallback } from 'react';
import * as Clipboard from 'expo-clipboard';
import useToast from '../../hooks/useToast';
import Colors from '../../constants/Colors';

function AboutApp() {
  const userid = useUserState((state) => state._id);
  const { toast } = useToast();

  const copyId = useCallback(async () => {
    if (userid) {
      await Clipboard.setStringAsync(userid);
      toast('User ID has been copied to your clipboard');
    }
  }, [userid]);

  return (
    <View style={styles.wrapper}>
      <View style={{ width: '80%' }}>
        <Headline>About this app</Headline>
        <View style={{ height: 16 }} />
        <Body>
          This app is an open source project initiated by Kexx Kultur AB. The BETA version is a
          collaboration between Kexx Kultur, Live at Heart and Kent Cederström (@kentos)
        </Body>
        <View style={{ height: 16 }} />
        <Body>Feel free to take part of, share and make contributions over at</Body>
        <TouchableOpacity onPress={() => Linking.openURL('http://github.com/kentos/liveatheart')}>
          <Body color={Colors.light.tint}>http://github.com/kentos/liveatheart</Body>
        </TouchableOpacity>
        <View style={{ height: 16 }} />
        <Body bold>Contributors:</Body>
        <Body>Kent Cederström</Body>
        <Body>Erik Wärlegård</Body>
        {userid && (
          <>
            <View style={{ height: 16 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Body bold>Your ID</Body>
              <BodySmall> (tap to copy)</BodySmall>
            </View>
            <TouchableOpacity onPress={copyId}>
              <Caption>{userid}</Caption>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AboutApp;
