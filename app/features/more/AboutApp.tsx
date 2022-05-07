import { View, StyleSheet } from 'react-native';
import { Body, Headline, Title } from '../../components/Texts';

function AboutApp() {
  return (
    <View style={styles.wrapper}>
      <View style={{ width: '80%' }}>
        <Headline>About this app</Headline>
        <View style={{ height: 16 }} />
        <Body>
          This app is brought to you by a collaboration between Live At Heart and Kent Cederström
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
