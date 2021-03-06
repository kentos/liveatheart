import { Pressable, View, StyleSheet, ViewStyle } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import Colors from '../constants/Colors';

interface CloseButtonProps {
  back?: boolean;
  style?: ViewStyle;
  onPress?: () => void;
}

function CloseButton({ back = false, style, onPress }: CloseButtonProps) {
  const navigation = useNavigation();
  const onPressFn = useCallback(() => {
    if (onPress) {
      onPress();
    } else {
      navigation.goBack();
    }
  }, [onPress, navigation]);
  return (
    <Pressable style={({ pressed }) => [pressed && { opacity: 0.8 }, style]} onPress={onPressFn}>
      <View style={styles.wrapper}>
        <FontAwesome
          size={20}
          color={Colors.light.text}
          style={[{ marginLeft: 2, width: 20, height: 20 }]}
          name={back ? 'chevron-left' : 'close'}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.light.background,
    borderRadius: 100,
    padding: 8,
  },
});

export default CloseButton;
