import { StyleSheet, View } from 'react-native';
import { Body, Title } from '../../../components/Texts';
import Colors from '../../../constants/Colors';

function EmptyFaveList() {
  return (
    <View style={styles.wrapper}>
      <Title center color="white">
        You're favorites list is empty
      </Title>
      <View style={{ height: 16 }} />
      <Body color="white">You can add artist as your favorite and see them all here.</Body>
      <Body color="white">
        When the programme is ready, you'll have an easier way to see what artists you'd like to see
        at Live at Heart.
      </Body>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.light.tint,
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
});

export default EmptyFaveList;
