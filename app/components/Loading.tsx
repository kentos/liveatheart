import { FontAwesome } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import Colors from '../constants/Colors';
import { Caption } from './Texts';

export default function Loading({ size, caption }: { caption?: string; size?: number }) {
  return (
    <Animatable.View animation="pulse" iterationCount={'infinite'} style={{ alignItems: 'center' }}>
      <FontAwesome name={'heart-o'} size={size || 64} color={Colors.light.tint} />
      {caption && <Caption>{caption}</Caption>}
    </Animatable.View>
  );
}
