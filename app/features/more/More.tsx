import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Body } from '../../components/Texts';
import Colors from '../../constants/Colors';
import { resetClient } from '../../contexts/session/restoreUserSession';

function Item({ title, onPress }: { title: string; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={stylesItem.item}>
        <Body color={Colors.light.tint}>{title}</Body>
        <FontAwesome size={20} name="angle-right" color={Colors.light.tint} />
      </View>
    </TouchableOpacity>
  );
}

const stylesItem = StyleSheet.create({
  item: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomColor: Colors.light.border,
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});

function More() {
  const navigation = useNavigation();
  return (
    <ScrollView>
      <Item title="Your profile" onPress={() => navigation.navigate('Profile')} />
      <Item title="Buy tickets" onPress={() => navigation.navigate('Tickets')} />
      <Item
        title="About Live at Heart"
        onPress={() =>
          navigation.navigate('WebView', {
            url: 'https://liveatheart.se/about-live-at-heart/?in_app=1',
            title: 'About Live at Heart',
          })
        }
      />
      <Item
        title="Partners"
        onPress={() => {
          navigation.navigate('WebView', {
            url: 'https://liveatheart.se/partners-2022/?in_app=1',
            title: 'Partners',
          });
        }}
      />
      <Item title="About the app" onPress={() => navigation.navigate('AboutApp')} />
      {__DEV__ && (
        <Item
          title="Debug: Log out"
          onPress={() => {
            resetClient();
          }}
        />
      )}
    </ScrollView>
  );
}

export default More;
