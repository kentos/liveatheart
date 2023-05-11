import { useCallback } from 'react';
import Toast from 'react-native-root-toast';
import Colors from '../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function useToast() {
  const insets = useSafeAreaInsets();
  const toast = useCallback((msg: string) => {
    Toast.show(msg, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP,
      backgroundColor: Colors.light.tint,
      shadow: false,
      containerStyle: {
        marginTop: insets.top,
        borderWidth: 0,
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 20,
      },
    });
  }, []);

  return { toast };
}
