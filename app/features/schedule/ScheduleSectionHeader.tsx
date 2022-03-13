import { View, StyleSheet } from 'react-native';
import { Text } from '../../components/Themed';

interface ScheduleSectionHeaderProps {
  title: string;
}

function ScheduleSectionHeader({ title }: ScheduleSectionHeaderProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomColor: 'rgba(0,0,0,.15)',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontWeight: '200',
    fontSize: 32,
  },
});

export default ScheduleSectionHeader;
