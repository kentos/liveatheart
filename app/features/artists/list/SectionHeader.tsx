import { View, StyleSheet } from 'react-native';
import { Text } from '../../../components/Themed';

interface SectionHeaderProps {
  title: string;
}

function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    padding: 8,
    borderBottomColor: 'rgba(0,0,0,.15)',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontWeight: '600',
    color: 'rgba(0,0,0,.75)',
  },
});

export default SectionHeader;
