import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Body } from '../../components/Texts';
import Colors from '../../constants/Colors';

function Item({ title, onPress }: { title: string; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          padding: 16,
          backgroundColor: 'white',
          borderBottomColor: Colors.light.border,
          borderBottomWidth: 1,
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}
      >
        <Body color={Colors.light.tint}>{title}</Body>
        <FontAwesome size={20} name="angle-right" color={Colors.light.tint} />
      </View>
    </TouchableOpacity>
  );
}

function More() {
  const navigation = useNavigation();
  return (
    <ScrollView>
      <Item title="Buy tickets" onPress={() => navigation.navigate('Tickets')} />
      <Item
        title="About Live at Heart"
        onPress={() =>
          navigation.navigate('WebView', {
            url: 'https://liveatheart.se/about/',
            title: 'About Live at Heart',
          })
        }
      />
      <Item title="About the app" onPress={() => navigation.navigate('AboutApp')} />
    </ScrollView>
  );
}

export default More;
