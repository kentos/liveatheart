import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useLayoutEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
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

  return (
    <>
      <RNWebView source={{ uri: route.params.url }} onLoadEnd={() => setLoading(false)} />
      {loading && (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
          }}
        >
          <ActivityIndicator />
        </View>
      )}
    </>
  );
}

export default WebView;
