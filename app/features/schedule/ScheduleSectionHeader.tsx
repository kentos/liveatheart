import { View, StyleSheet } from 'react-native';
import { Title } from '../../components/Texts';

interface ScheduleSectionHeaderProps {
  title: string;
}

function ScheduleSectionHeader({ title }: ScheduleSectionHeaderProps) {
  return (
    <View style={styles.wrapper}>
      <Title>{title}</Title>
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
