import { FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';

type Props = {
  active: boolean;
  inverted?: boolean;
  toggle: () => void;
  size: number;
};

const getColor = (inverted: boolean, active: boolean) =>
  active ? (inverted ? '#fff' : '#e00') : inverted ? '#fff' : Colors.light.tint;

function HeartButton({ toggle, inverted = false, active, size }: Props) {
  return (
    <TouchableOpacity
      onPress={toggle}
      hitSlop={{ left: size / 2, right: size / 2, bottom: size / 2, top: size / 2 }}
    >
      <FontAwesome
        name={active ? 'heart' : 'heart-o'}
        size={size}
        color={getColor(inverted, active)}
      />
    </TouchableOpacity>
  );
}

export default HeartButton;
