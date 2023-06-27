import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Body } from './Texts';
import Colors from '../constants/Colors';

type Props = {
  children: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  inverted?: boolean;
};

function Button({ children, onPress, disabled, loading, inverted }: Props) {
  return (
    <Pressable
      disabled={disabled}
      onPress={() => !disabled && onPress()}
      style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
    >
      <View style={[styles.btn, disabled && styles.disabled, inverted && styles.btnInverted]}>
        <Body color={inverted ? Colors.light.background : Colors.light.tint}>{children}</Body>
        {loading && (
          <ActivityIndicator
            size={'small'}
            color={inverted ? Colors.light.background : Colors.light.tint}
            style={{ marginLeft: 8, marginRight: -28 }}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderColor: Colors.light.tint,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnInverted: {
    backgroundColor: Colors.light.tint,
  },
  disabled: { opacity: 0.25 },
});

export default Button;
