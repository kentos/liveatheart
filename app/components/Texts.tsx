import Colors from '../constants/Colors';
import { Text, TextProps } from './Themed';

export function Headline(props: TextProps) {
  return <Text style={{ fontSize: 20, lineHeight: 24, color: Colors.light.tint }} {...props} />;
}

export function Title(props: TextProps) {
  return <Text style={{ fontSize: 18, textTransform: 'capitalize' }} {...props} />;
}

export function Body(props: { color?: string } & TextProps) {
  return (
    <Text
      style={{ fontSize: 16, lineHeight: 22, color: props.color || Colors.light.text }}
      {...props}
    />
  );
}

export function Caption(props: { color?: string } & TextProps) {
  return (
    <Text
      style={{ fontSize: 12, textTransform: 'uppercase', lineHeight: 18, color: props.color }}
      {...props}
    />
  );
}
