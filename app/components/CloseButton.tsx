import { Pressable, View, StyleSheet, Image, ViewStyle } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface CloseButtonProps {
  back?: boolean;
  style?: ViewStyle;
  onPress: () => void;
}

function CloseButton({ back = false, style, onPress }: CloseButtonProps) {
  return (
    <Pressable style={({ pressed }) => [pressed && { opacity: 0.8 }, style]} onPress={onPress}>
      <View style={{ backgroundColor: '#efefef', borderRadius: 100, padding: 8 }}>
        <FontAwesome
          size={24}
          style={{ width: 24, height: 24, textAlign: 'center' }}
          name={back ? 'chevron-left' : 'close'}
        />
      </View>
    </Pressable>
  );
}

export default CloseButton;
