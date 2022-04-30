import { Text, TextProps } from './Themed';

export function Headline(props: TextProps) {
  return <Text style={{ fontSize: 24, lineHeight: 32, textTransform: 'capitalize' }} {...props} />;
}

export function Title(props: TextProps) {
  return <Text style={{ fontSize: 18, textTransform: 'capitalize' }} {...props} />;
}

export function Body(props: TextProps) {
  return <Text style={{ fontSize: 16, lineHeight: 22 }} {...props} />;
}
