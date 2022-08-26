import { TextStyle } from 'react-native';
import Colors from '../constants/Colors';
import { Text, TextProps } from './Themed';

export function Headline(props: TextProps) {
  return (
    <Text
      style={{
        fontFamily: 'Archia-Medium',
        fontSize: 20,
        lineHeight: 26,
        color: Colors.light.tint,
        ...(props.style as TextStyle),
      }}
      {...props}
    />
  );
}

export function Title(props: { color?: string } & TextProps) {
  return (
    <Text
      style={{
        fontSize: 17,
        color: props.color || Colors.light.text,
        ...(props.style as TextStyle),
      }}
      {...props}
    />
  );
}

export function Body(props: { bold?: boolean; color?: string } & TextProps) {
  return (
    <Text
      style={{
        fontSize: 14,
        lineHeight: 24,
        color: props.color || Colors.light.text,
        ...(props.style as TextStyle),
        ...(props.bold && { fontFamily: 'Archia-Bold' }),
      }}
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
