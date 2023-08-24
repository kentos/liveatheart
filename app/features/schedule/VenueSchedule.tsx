import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types';
import { Body, Headline, Title } from '../../components/Texts';
import { trpc } from '../../libs/trpc';
import { useLayoutEffect, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import Colors from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { groupBy } from 'lodash';
import { format } from 'date-fns';

export default function VenueSchedule() {
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<RootStackParamList, 'VenueSchedule'>>();
  const { data, error } = trpc.program.getScheduleByVenue.useQuery({ venueId: params.venueId });

  useLayoutEffect(() => {
    if (data?.venue) {
      navigation.setOptions({
        title: data.venue.name,
      });
    }
  }, [data]);

  const days = useMemo(() => {
    return groupBy(data?.program, (item) => item.day);
  }, [data]);

  console.log('DAYS', Object.keys(days));

  return (
    <SafeAreaView edges={['bottom']}>
      <ScrollView>
        {Object.keys(days)?.map((day) => (
          <View key={day}>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: Colors.light.border,
                paddingVertical: 8,
                paddingHorizontal: 8,
                paddingTop: 16,
              }}
            >
              <Headline>{day}</Headline>
            </View>
            {days[day]?.map((item) => (
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.light.border,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: 'white',
                  paddingVertical: 8,
                  paddingHorizontal: 8,
                }}
              >
                <Body key={item._id}>{item.artist?.name}</Body>
                <Body>{item.time}</Body>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
