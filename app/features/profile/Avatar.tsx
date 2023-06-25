import { StyleSheet, View } from 'react-native';
import Colors from '../../constants/Colors';
import { Headline } from '../../components/Texts';

function Avatar({ size = 96, firstName = '', lastName = '' }) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
        },
      ]}
    >
      <Headline style={[styles.text, { fontSize: size / 2.2 }]}>{initials}</Headline>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    backgroundColor: Colors.light.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.light.background,
  },
});

export default Avatar;
