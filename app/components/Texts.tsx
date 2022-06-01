import Colors from '../constants/Colors';
import { Text, TextProps } from './Themed';

export function Headline(props: TextProps) {
  return (
    <Text
      style={{
        fontFamily: 'Archia-SemiBold',
        fontSize: 20,
        lineHeight: 26,
        color: Colors.light.tint,
      }}
      {...props}
    />
  );
}

export function Title(props: { color?: string } & TextProps) {
  return (
    <Text
      style={{ fontSize: 17, color: props.color || Colors.light.text, textTransform: 'capitalize' }}
      {...props}
    />
  );
}

export function Body(props: { color?: string } & TextProps) {
  return (
    <Text
      style={{ fontSize: 14, lineHeight: 20, color: props.color || Colors.light.text }}
      {...props}
    />
  );
}

export function Caption(props: { color?: string } & TextProps) {
  return (
    <Text
      style={{
        fontSize: 12,
        textTransform: 'uppercase',
        lineHeight: 18,
        color: props.color || Colors.light.text,
      }}
      {...props}
    />
  );
}
