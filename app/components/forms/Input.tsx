import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import Colors from '../../constants/Colors';

export default function Input(props: TextInputProps) {
  return <TextInput style={stylesInput.input} {...props} />;
}

const stylesInput = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderColor: Colors.light.border,
    fontSize: 18,
    padding: 12,
    borderRadius: 12,
    fontFamily: 'Archia-Medium',
  },
});
