import { ActivityIndicator, Pressable, View } from 'react-native';
import { Body } from './Texts';
import Colors from '../constants/Colors';

type Props = {
  children: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

function Button({ children, onPress, disabled, loading }: Props) {
  return (
    <Pressable
      disabled={disabled}
      onPress={() => !disabled && onPress()}
      style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
    >
      <View
        style={[
          {
            borderColor: Colors.light.tint,
            borderWidth: 1,
            borderRadius: 12,
            paddingVertical: 8,
            paddingHorizontal: 12,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
          },
          disabled && { opacity: 0.25 },
        ]}
      >
        <Body color={Colors.light.tint}>{children}</Body>
        {loading && (
          <ActivityIndicator
            size={'small'}
            color={Colors.light.tint}
            style={{ marginLeft: 8, marginRight: -28 }}
          />
        )}
      </View>
    </Pressable>
  );
}

export default Button;
