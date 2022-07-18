import WebView from 'react-native-webview';
import Layout from '../../../constants/Layout';

interface Props {
  uri: string;
}

function SpotifyEmbed({ uri }: Props) {
  return (
    <WebView
      source={{ uri }}
      style={{ flex: 0, height: Layout.window.width / 1.78, opacity: 0.99 }}
      containerStyle={{ flex: 0 }}
    />
  );
}

export default SpotifyEmbed;
