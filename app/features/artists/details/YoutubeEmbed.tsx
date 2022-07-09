import WebView from 'react-native-webview';
import Layout from '../../../constants/Layout';

interface Props {
  uri: string;
}

function YoutubeEmbed({ uri }: Props) {
  return (
    <WebView
      source={{ uri }}
      style={{ flex: 0, height: Layout.window.width / 1.78 }}
      containerStyle={{ flex: 0 }}
    />
  );
}

export default YoutubeEmbed;
