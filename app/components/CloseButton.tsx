import { Pressable, View, StyleSheet, ViewStyle } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface CloseButtonProps {
  back?: boolean;
  style?: ViewStyle;
  onPress: () => void;
}

function CloseButton({ back = false, style, onPress }: CloseButtonProps) {
  return (
    <Pressable style={({ pressed }) => [pressed && { opacity: 0.8 }, style]} onPress={onPress}>
      <View style={styles.wrapper}>
        <FontAwesome
          size={24}
          style={[back && { marginLeft: 2 }, { width: 24, height: 24 }]}
          name={back ? 'chevron-left' : 'close'}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#efefef',
    borderRadius: 32,
    padding: 8,
  },
});

export default CloseButton;
