import { StyleSheet, View } from 'react-native';
import { Body, Title } from '../../../components/Texts';
import Colors from '../../../constants/Colors';

function EmptyFaveList() {
  return (
    <View style={styles.wrapper}>
      <Title center color="white">
        Your favorites list is empty!
      </Title>
      <View style={{ height: 16 }} />
      <Body color="white">
        You can add artist as your favorite by marking them with a heart and see them all here.
      </Body>
      <View style={{ height: 8 }} />
      <Body color="white">
        When the programme is ready, you'll have an easier way to see what artists you'd like to see
        at Live at Heart.
      </Body>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.light.tint,
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
});

export default EmptyFaveList;
