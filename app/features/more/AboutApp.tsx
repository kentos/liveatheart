import { View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Body, Caption, Headline } from '../../components/Texts';
import useUserState from '../../contexts/session/useUserState';

function AboutApp() {
  const userid = useUserState((state) => state._id);
  return (
    <View style={styles.wrapper}>
      <View style={{ width: '80%' }}>
        <Headline>About this app</Headline>
        <View style={{ height: 16 }} />
        <Body>
          This app is brought to you by a collaboration between Live at Heart and Kent Cederström
          (@kentos).
        </Body>
        <View style={{ height: 16 }} />
        <Body>
          The app is an open source project and feel free to make contributions at
          github.com/kentos/liveatheart
        </Body>
        <View style={{ height: 16 }} />
        <Body bold>Contributors:</Body>
        <Body>Kent Cederström</Body>
        <Body>David Littorin</Body>
        {userid && (
          <>
            <View style={{ height: 16 }} />
            <Body bold>Your ID</Body>
            <TouchableOpacity>
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
