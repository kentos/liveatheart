import { Dimensions, Pressable, StyleSheet } from 'react-native';
import { Body } from '../Texts';
import Colors from '../../constants/Colors';

export default function SegmentedButton({
  text,
  active,
  onPress,
  compact,
}: {
  text: string;
  active?: boolean;
  onPress: () => void;
  compact?: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        { opacity: pressed ? 0.5 : 1 },
        stylesButton.btn,
        active && stylesButton.active,
        compact && stylesButton.compact,
      ]}
      onPress={onPress}
    >
      <Body color={active ? 'white' : Colors.light.tint} numberOfLines={1} adjustsFontSizeToFit>
        {text}
      </Body>
    </Pressable>
  );
}

const stylesButton = StyleSheet.create({
  btn: {
    width: Dimensions.get('window').width / 3.5,
    marginHorizontal: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.light.tabIconSelected,
  },
  active: {
    backgroundColor: Colors.light.tabIconSelected,
  },
  compact: {
    paddingVertical: 4,
    width: Dimensions.get('window').width / 5,
  },
});
