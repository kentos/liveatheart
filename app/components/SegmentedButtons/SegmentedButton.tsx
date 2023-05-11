import { Dimensions, Pressable, StyleSheet } from 'react-native';
import { Body } from '../Texts';
import Colors from '../../constants/Colors';

export default function SegmentedButton({
  text,
  active,
  onPress,
}: {
  text: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        { opacity: pressed ? 0.5 : 1 },
        stylesButton.btn,
        active && stylesButton.active,
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
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Colors.light.background,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.light.tabIconSelected,
  },
  active: {
    backgroundColor: Colors.light.tabIconSelected,
  },
});
