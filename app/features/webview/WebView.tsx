import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useLayoutEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import RNWebView from 'react-native-webview';
import { RootStackParamList } from '../../types';

export interface WebViewProps {
  url: string;
  title?: string;
}

function WebView() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'WebView'>>();
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.title || '',
    });
  }, [route.params.title]);

  const source = useMemo(() => {
    return {
      uri: route.params.url,
    };
  }, [route.params.url]);

  return (
    <>
      <RNWebView source={source} onLoadEnd={() => setLoading(false)} />
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});

export default WebView;
